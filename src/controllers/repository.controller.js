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
import { createLog } from "../utils/activity.util.js";


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

    // logging the import
    await createLog(
      req.user._id,
      newRepo[0]._id,
      "imported repository",
      "repository",
      newRepo[0]._id,
      `Initialized workspace for ${name}`
    )

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

    // log the sync
    await createLog(
    req.user._id, 
    repo._id, 
    "synchronized", 
    "repository", 
    repo._id, 
    `Updated metadata and languages from GitHub`
  );

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
    

    // cache invalidation 
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

    // log tagging a repo
    await createLog(
      req.user._id,
      repo._id,
      "tagged workspace",
      "workspace",
      repo._id,
      `Added tag #${tag} to ${repo.name}`
    );

    // cache invalidation
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
    // first need to get the name
    const repo = await Repository.findById(req.params.id);
    const repoName = repo.name;

    await Repository.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { reposOwned: req.params.id },
    });

    // log the deletion
    await createLog(
      req.user._id,
      null, 
      "deleted workspace",
      "workspace",
      req.params.id,
      `Removed ${repoName} from Dir workspaces`
    );

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



