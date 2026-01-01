import { User } from "../models/user.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { StatusCodes } from "http-status-codes";
import { createGitHubClient } from "../config/github.js";
import mongoose from "mongoose";
import { Repository } from "../models/repository.model.js";
import { getOrSetCache } from "../utils/cache.util.js";
import redisClient from "../config/redis.js";
import { getLanguageColor } from "../utils/githubColors.js";
import {Tag} from "../models/tag.model.js";


// cache keys

const getDiscoveryKey = (userId) => `repos:discovery:${userId}`;
const getActiveListKey = (userId) => `repos:active:${userId}`;
const getRepoDetailKey = (userId) => `repos:detail:${userId}`;
//@desc 1. discovery: list remote github repositories
//@route GET /api/repos/discovery

export const getGithubRepos = async (req, res) => {
  try {
  
   const cacheKey = getDiscoveryKey(req.user._id);
   
   // caching it 
   const discoveryList = await getOrSetCache(cacheKey, async () => {
    const octokit = createGitHubClient(req.user.accessToken);
    const { data: githubRepos } =
      await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
      });


      const importedRepos = await Repository.find({
      ownerId: req.user._id,
    }).select("githubId -_id");
    const importedIds = new Set(
      importedRepos.filter(repo => repo.githubId).map((repo) => repo.githubId.toString())
    );

    return githubRepos.map((repo) => ({
      githubId: repo.id.toString(),
      name: repo.name,
      fullName: repo.full_name,
      isImported: importedIds.has(repo.id.toString()),
      description: repo.description,
      url: repo.html_url,
      language: repo.language,
    }));
   }, 600) // 10 minute ttl
    

    
    res.status(StatusCodes.OK).json({
      status: "success",
      totalInGithub: req.user.githubRepoCount,
      data: discoveryList,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  }
};

//@desc 2. import/activate a github repo as a dir workspace
//@route POST /api/repos/import
export const importRepo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { githubId, name, description, url, language } = req.body;

    //check if repo already imported
    const existingRepo = await Repository.findOne({ githubId });
    if (existingRepo) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Repository already imported",
      });
    }
    //create new repository document to store it in repository collection
    const newRepo = await Repository.create(
      [
        {
          githubId,
          name,
          description,
          ownerId: req.user._id,
          url,
          language,
          members: [{ userId: req.user._id, role: "owner" }],
          channels: [
            { name: "general", channel_id: new mongoose.Types.ObjectId() },
          ],
        },
      ],
      { session }
    );

    //update user's reposOwned list
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { reposOwned: newRepo[0]._id },
      },
      { session }
    );

    await session.commitTransaction();

    // invalidating cache- because when we call getGitHubRepo, we will get the old data if invalidation doesn't take place
    await redisClient.del(getDiscoveryKey(req.user._id))
    await redisClient.del(getActiveListKey(req.user._id))

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: newRepo[0],
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

//@desc 3. get all active(imported) Dir repos(workspaces)
//@route GET /api/repos/
export const getActiveRepos = async (req, res) => {
  try {
    const { search, tag } = req.query;
    let query = { "members.userId": req.user._id };

    // only caching the default view (no search/tag)

    if(!search && !tag){
      const cacheKey = getActiveListKey(req.user._id);
      const activeRepos = await getOrSetCache(cacheKey,async ()=> {
        return await Repository.find(query).select("-webhookEvents").lean();
      }, 1800); 
    }
    
    // direct db query for filtered results
    if (search) query.name = { $regex: search, $options: "i" };
    if (tag) query.tags = tag;

    const repos = await Repository.find(query).select("-webhookEvents");
    res.status(StatusCodes.OK).json({ status: "success", data: repos });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
};

//@desc 4. detailed view
//@route GET /api/repos/:id
export const getActiveRepo = async (req, res) => {
  try {

    const cacheKey = getRepoDetailKey(req.params.id);
    const repo = await getOrSetCache(cacheKey, async () => {
      return await Repository.findById(req.params.id).populate(
      "members.userId",
      "githubUsername avatarUrl"
    ).lean(); // lean() - caching plain JSON
    }, 3600);

    if (!repo)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Not found",
      });

    res.status(StatusCodes.OK).json({ status: "success", data: repo });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//@desc 5. Manual sync with Github
//@route POST /api/repos/:id/sync
export const manualSync = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);
    const octokit = createGitHubClient(req.user.accessToken);

    //fetch the repo from github using the stored owner and repo
    const { data: githubData } = await octokit.rest.repos.get({
      owner: req.user.githubUsername,
      repo: repo.name,
    });
    // update DB
    repo.description = githubData.description;
    repo.language = githubData.language; //to update the current programming language in dir from github
    await repo.save();

    // cache invalidation
    await Promise.all([
      redisClient.del(getRepoDetailKey(req.params.id)),
      redisClient.del(getActiveListKey(req.user._id))
    ])

    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Synced with Github" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
};

//@desc 6 update metadata in repo
//@route PATCH /api/repos/:id
export const updateRepo = async (req, res) => {
  try {
    const updatedRepo = await Repository.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    await redisClient.del(getRepoDetailKey(req.params.id))
    await redisClient.del(getActiveListKey(req.user._id))

    //@todo: after update also try to update the githbub repo via api if name/description changed
    res.status(StatusCodes.OK).json({ status: "success", data: updatedRepo });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

//@desc 7. Add tags to repos
//@route POST api/repos/:id/tags
export const addTags = async (req, res) => {
  try {
    const { tag } = req.body;
    const repo = await Repository.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tags: tag } },
      { new: true }
    );

    await Promise.all([
      redisClient.del(getRepoDetailKey(req.params.id)),
      redisClient.del(getActiveListKey(req.user._id))
    ])

    res.status(StatusCodes.OK).json({ status: "success", data: repo });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//@desc 8. Delete workspace or simply delete a repo
//@route DELETE /api/repos/:id
export const deleteRepo = async (req, res) => {
  try {
    await Repository.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { reposOwned: req.params.id },
    });

    //invalidation of cache
    await Promise.all([
      
      redisClient.del(getRepoDetailKey(req.params.id)),
      redisClient.del(getActiveListKey(req.user._id)),
      redisClient.del(getDiscoveryKey(req.user._id))

    ])
    //@todo: also make the status of the github to be just normal github not workspace 
    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Removed from DIR" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};


//@todo: add a controller to create repo in github from dir directly
//@todo: also a controller to delete directly from dir to github



//@desc 9. Explore pubilc repos by tag
//@route GET /api/repos/explore

export const explorePublicRepos = async (req,res) => {
  try {
    const {page = 1, q , tag} = req.query;
    const perPage = 6;
    const pageNum = parseInt(page);
    const cacheKey = `explore:v5:q=${q || 'all'}:tag=${tag || 'none'}:page=${pageNum}`

    const data = await getOrSetCache(cacheKey, async () => {
      const octokit = createGitHubClient(req.user.accessToken)

      //Global search: includes all users, filtered by stars for quality
      let query = "is:pubilc stars:>50";
      if (q) query += ` ${q}`;
      if (tag) query += ` topic:${tag}`;

      const {data:searchResults} = await octokit.rest.search.repos({
        q:query,
        sort: "updated",
        per_page: perPage,
        page:pageNum,
      });


      const githubIds = searchResults.items.map(repo => repo.id.toString());
      const existingRepos = await Repository.find({
        githubId: { $in: githubIds },
      }).select("githubId -_id");

      const existingIdsSet = new Set(existingRepos.map(r => r.githubId));


      // map and fetching the language stats in parallel

      const repos = await Promise.all(
        searchResults.items.map(async (repo) => {
          try {
            const {data: langData} = await octokit.rest.repos.listLanguages({
              owner: repo.owner.login,
              repo:repo.name,
            });

            const total = Object.values(langData).reduce((a,b) => a + b, 0);
            const languages = Object.entries(langData).map(([label, bytes]) => ({
                label, 
                value: parseFloat(((bytes/total)* 100).toFixed(1)),
                color: getLanguageColor(label)
            })).filter(l => l.value > 1.0).sort((a,b)=> b.value - a.value);


            return {
              githubId:repo.id.toString(),
              name: repo.name,
              owner: repo.owner.login,
              avatar: repo.owner.avatar_url,
              description: repo.description,
              stars: repo.stargazers_count,
              url: repo.html_url,
              tags: repo.topics || [],
              languages,
              isImported: existingIdsSet.has(repo.id.toString()),

            }

          } catch (error) {
            
            return {}
          }
        })
      );

      return {
        total: searchResults.total_count, 
        repos,
        hasNextPage :searchResults.total_count > (pageNum * perPage)
      };
    }, 3600)

    res.status(StatusCodes.OK).json({
      status: "success",
      data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: error.message,
    });
  
  }
}

// @desc 10. Tag Topic Cloud - curated top industry topics for the discovery page
// @route GET /api/repos/topics

export const getPopularTopics = async (req,res)=>{
  try {
    // Manually curated list - //@todo: color can be changed later
    const curatedTopics = [
      { name: "health", label: "Health", color: "#4c7abcff" },
      { name: "agriculture", label: "Agriculture", color: "#50634bff" },
      { name: "government", label: "Government", color: "#4b5563" },
      { name: "system-programming", label: "System programming", color: "#4b5563" },
      { name: "web-development", label: "Web development", color: "#4b5563" },
      { name: "front-end", label: "Front-end", color: "#4b5563" },
      { name: "full-stack", label: "Full-stack", color: "#4b5563" },
      { name: "back-end", label: "Back-end", color: "#4b5563" },
      { name: "aerospace", label: "Aerospace", color: "#4b5563" },
      { name: "java", label: "Java", color: "#4b5563" },
      { name: "php", label: "PHP", color: "#4b5563" },
      { name: "ui-ux", label: "UI/UX", color: "#4b5563" },
      { name: "javascript", label: "JavaScript", color: "#4b5563" },
      { name: "cpp", label: "C++", color: "#4b5563" },
      { name: "rust", label: "Rust", color: "#4b5563" },
      { name: "linux", label: "Linux", color: "#4b5563" },
      { name: "kernel", label: "Kernel", color: "#4b5563" }
    ];
    const cacheKey = "explore:db_tags";

    const dbTags = await getOrSetCache(cacheKey, async()=> {
      // optional implementation
      // const octokit = createGitHubClient(req.user.accessToken);

      // // fetch top 100 most starred repos globally to find what's trending

      // const {data:searchResults} = await octokit.rest.search.repos({
      //   q: "stars:>10000",
      //   sort: "stars",
      //   order:"desc",
      //   per_page:100,
      // })

      // // aggerate and count tpics

      // const topicCounts = {};
      // searchResults.items.forEach(repo=> {
      //   (repo.topics || []).forEach(topic => {
      //     topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      //   })
      
      // })

      // // converting to array and sorting by freq and formating
      // return Object.entries(topicCounts).map(([name,count]) =>({
      //   name,
      //   label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
      //   count: `${count} active repos`
      // }) ).sort((a,b)=> parseInt(b.count) - parseInt(a.count))
      // .slice(0,15) // top 15 trending topics

      return await Tag.find({}).select("name description color -_id").lean();
    
    }, 3600)

    const topicMap = new Map();

    // curated topics take priority 
    dbTags.forEach(tag => {
      topicMap.set(tag.name, {
        name:tag.name,
        label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1).replace(/-/g, ' '),
        color:tag.color
      });
    });

    //overwrite with curated topics
    curatedTopics.forEach(topic=> topicMap.set(topic.name, topic));

    res.status(StatusCodes.OK).json({
      status: "success",
      data: Array.from(topicMap.values()),
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status:"error",
      message: error.message
    })
  }
}

// @desc saving custom tag
// @route POST /api/repos/topics
export const createTag = async (req,res)=> {
  try {
    const {name, description, color} = req.body;

    const formattedName = name.toLowerCase().trim().replace(/\s+/g, '-');

    const newTag = await Tag.create({
      name:formattedName,
      description,
      color: color || "#4f46e5",
      createdBy: req.user._id
    })

    // invalidate cache
    await redisClient.del("explore:db_tags");

    res.status(StatusCodes.CREATED).json({
      status: "success",
      data: newTag
    });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tag already exists" });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
}

// @desc remove custom tag 
// @route DELETE /api/repos/topics/:id
export const deleteTag = async (req,res)=> {
  try {
    const {id} = req.params;
    const userId = req.user._id;

    // finding tag
    const tag = await Tag.findById(id);
    if(!tag) return res.status(StatusCodes.NOT_FOUND).json({
      status: "error",
      message: "Tag not found"
    })

    const name = tag.name;

    // only tag creator can delete his/her custom tag
    if(!tag.createdBy ||tag.createdBy.toString() !== userId.toString() ){
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: "error",
        message: "Unauthorized"

    });
  }
    await Tag.findByIdAndDelete(id);

    // invalidating cache
    await redisClient.del("explore:db_tags");

    res.status(StatusCodes.OK).json({ 
      status: "success", 
      message: `${name} tag removed successfully and cache cleared`
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      status: "error", 
      message: error.message 
    });
  }
};