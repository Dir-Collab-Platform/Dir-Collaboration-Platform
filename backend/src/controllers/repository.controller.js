import { User } from "../models/user.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { StatusCodes } from "http-status-codes";
import { createGitHubClient } from "../config/github.js";
import mongoose from "mongoose";
import { Repository } from "../models/repository.model.js";
import {
  getOrSetCache,
  invalidateRepoCache,
  getDiscoveryKey,
  getActiveListKey,
  getRepoDetailKey,
  getRepoContentKey
} from "../utils/cache.util.js";
import redisClient from "../config/redis.js";
import { getLanguageColor } from "../utils/githubColors.js";
import { Tag } from "../models/tag.model.js";
import { createLog } from "../utils/activity.util.js";
import { registerWebhook } from "../services/webhook.service.js";
import { isValidObjectId } from "../utils/objectId.util.js";
//@desc 1. discovery: list remote github repositories
//@route GET /api/repos/discovery
export const getGithubRepos = async (req, res) => {
  try {
    const cacheKey = getDiscoveryKey(req.user._id);

    // caching it
    const discoveryList = await getOrSetCache(
      cacheKey,
      async () => {
        const octokit = createGitHubClient(req.user.accessToken);
        const { data: githubRepos } =
          await octokit.rest.repos.listForAuthenticatedUser({
            per_page: 100,
            sort: "updated",
          });

        const importedRepos = await Repository.find({
          ownerId: req.user._id,
        }).select("githubId _id");

        const importedMap = new Map(
          importedRepos
            .filter((repo) => repo.githubId)
            .map((repo) => [repo.githubId.toString(), repo._id])
        );

        return githubRepos.map((repo) => ({
          id: repo.id.toString(), // Frontend expects 'id' for key/navigation fallback
          githubId: repo.id.toString(), // Explicit Github ID
          _id: importedMap.get(repo.id.toString()) || null, // MongoDB ID if imported
          githubRepoName: repo.name,
          githubOwner: repo.owner.login,
          githubFullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          workspaceName: repo.name,
          isImported: importedMap.has(repo.id.toString()),
          // Added fields for UI
          stars: repo.stargazers_count,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
          visibility: repo.visibility || (repo.private ? 'private' : 'public'),
          default_branch: repo.default_branch
        }));
      },
      600
    ); // 10 minute ttl

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
    const {
      githubId,
      githubRepoName,
      githubOwner,
      githubFullName,
      description,
      url,
      language,
    } = req.body;

    //check if repo already imported
    const existingRepo = await Repository.findOne({ githubId });
    if (existingRepo) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Repository already imported",
      });
    }

    const octokit = createGitHubClient(req.user.accessToken);
    //create a webhook client here
    const { webhookId, secret } = await registerWebhook(
      octokit,
      githubOwner,
      githubRepoName
    );
    //create new repository document to store it in repository collection
    const newRepo = await Repository.create(
      [
        {
          githubId,
          githubRepoName,
          githubOwner,
          githubFullName,
          workspaceName: githubRepoName,
          description,
          ownerId: req.user._id,
          url,
          language,
          members: [{ userId: req.user._id, role: "owner" }],
          channels: [
            { name: "general", channel_id: new mongoose.Types.ObjectId() },
          ],
          //this also added for webhook
          webhookSettings: {
            webhookId,
            secret,
            active: true,
          },
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
      `Initialized workspace for ${githubRepoName}`
    );

    // cache invalidation
    //instead of this I created a
    // await redisClient.del(`user:stats:${req.user._id}`);
    //cache invalidation
    await invalidateRepoCache(req.user._id, newRepo[0]._id);
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
    await redisClient.del(getDiscoveryKey(req.user._id));
    await redisClient.del(getActiveListKey(req.user._id));

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
    //fetch query to get al the repos where user is a member
    let query = { "members.userId": req.user._id };

    if (tag) query.tags = tag;

    //search across workspaceName, githubRepoName and tags
    // only caching the default view (no search/tag)
    if (!search && !tag) {
      const cacheKey = getActiveListKey(req.user._id);
      const activeRepos = await getOrSetCache(
        cacheKey,
        async () => {
          return await Repository.find(query)
            .select("-webhookEvents")
            .populate("members.userId", "avatarUrl githubUsername")
            .lean();
        },
        1800
      );

      return res.status(StatusCodes.OK).json({
        status: "success",
        results: activeRepos.length,
        data: activeRepos,
      });
    }

    // direct db query for filtered results
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$or = [
        { workspaceName: searchRegex },
        { githubRepoName: searchRegex },
        { tags: searchRegex }, //search for custom tags as well
      ];
    }

    // ✅ Also use .lean() here for consistency
    const repos = await Repository.find(query)
      .select("-webhookEvents")
      .populate("members.userId", "avatarUrl githubUsername")
      .lean(); // ✅ Add .lean() for consistency with cached path

    res.status(StatusCodes.OK).json({
      status: "success",
      results: repos.length,
      data: repos, // ✅ All IDs are strings (consistent)
    });
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
    // ✅ Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Invalid repository ID format"
      });
    }

    const cacheKey = getRepoDetailKey(req.params.id);
    const repo = await getOrSetCache(
      cacheKey,
      async () => {
        return await Repository.findById(req.params.id)
          .populate("members.userId", "githubUsername avatarUrl")
          .lean(); // ✅ Consistent with getActiveRepos - returns plain objects with string IDs
      },
      3600
    );

    if (!repo)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Repository not found",
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
    if (!repo)
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Not found" });

    const octokit = createGitHubClient(req.user.accessToken);

    // sync using
    const { data: githubRepo } = await octokit.rest.repos.get({
      owner: repo.githubOwner,
      repo: repo.githubRepoName,
    });

    // update DB
    repo.description = githubRepo.description;
    repo.language = githubRepo.language;
    repo.isPrivate = githubRepo.private;
    //here only change the remote github repo name if user has changed it in github
    repo.githubRepoName = githubRepo.name;
    repo.githubFullName = githubRepo.full_name;

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
      redisClient.del(getActiveListKey(req.user._id)),
      redisClient.del(getDiscoveryKey(req.user._id)),
    ]);

    res
      .status(StatusCodes.OK)
      .json({ status: "success", message: "Synced with GitHub" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//@desc 6 update metadata in repo
//@route PATCH /api/repos/:id
export const updateRepo = async (req, res) => {
  try {
    const { id } = req.params;
    const { workspaceName, description } = req.body;

    // 1. Validation
    if (workspaceName !== undefined && workspaceName.trim() === "") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "Repository name cannot be empty",
      });
    }

    const repo = await Repository.findById(id);
    if (!repo) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Workspace not found" });
    }

    // 2. Prepare GitHub Update
    const octokit = createGitHubClient(req.user.accessToken);
    let isGithubUpdate = false;
    const githubUpdate = {
      owner: repo.githubOwner,
      repo: repo.githubRepoName,
      description: description,
    };

    if (description !== undefined) {
      githubUpdate.description = description;
      isGithubUpdate = true;
    }

    // OPTIONAL: If workspaceName should sync with GitHub name:
    // if (workspaceName !== undefined) {
    //   githubUpdate.name = workspaceName;
    //   isGithubUpdate = true;
    // }

    if (isGithubUpdate) {
      await octokit.rest.repos.update(githubUpdate);
    }

    // 3. Update Local DB (Safely)
    const updateData = {};
    if (workspaceName !== undefined) updateData.workspaceName = workspaceName;
    if (description !== undefined) updateData.description = description;

    const updatedRepo = await Repository.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // 4. Cache Invalidation
    if (redisClient) {
      await redisClient.del(getRepoDetailKey(id));
      await redisClient.del(getActiveListKey(req.user._id));
      await redisClient.del(getDiscoveryKey(req.user._id));
    }

    res.status(StatusCodes.OK).json({
      status: "success",
      message: isGithubUpdate
        ? "Updated locally and on GitHub"
        : "Updated locally",
      data: updatedRepo,
    });
  } catch (error) {
    // Check for specific GitHub errors (like repo name already taken)
    const status = error.status || StatusCodes.BAD_REQUEST;
    res.status(status).json({ status: "error", message: error.message });
  }
};

//@desc 7. Add tags to repos
//@route POST api/repos/:id/tags
export const addTags = async (req, res) => {
  try {
    const { tag } = req.body;

    // standardize formatting
    const formattedTag = tag.trim().toLowerCase().replace(/\s+/g, "-");

    // ensuring the tag exists in the global tag list if not creating it
    const tagResult = await Tag.findOneAndUpdate(
      { name: formattedTag },
      {
        $setOnInsert: {
          name: formattedTag,
          description: `Custom Tag - ${formattedTag} created via workspace`,
          color: "#4f46e5",
          createdBy: req.user._id,
        },
      },
      { upsert: true, new: true, includeResultMetadata: true }
    );

    const isNewTag = tagResult.upsertedId !== null;

    // tagging the workspace
    const repo = await Repository.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tags: formattedTag } },
      { new: true }
    );

    // Safety Check: If repo doesn't exist, don't try to log or delete cache
    if (!repo) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Workspace not found" });
    }

    // log tagging a repo
    await createLog(
      req.user._id,
      repo._id,
      "tagged workspace",
      "workspace",
      repo._id,
      `Added tag #${formattedTag} to ${repo.workspaceName}`
    );

    // cache invalidation
    await Promise.all([
      redisClient.del(getRepoDetailKey(req.params.id)),
      redisClient.del(getActiveListKey(req.user._id)),
      isNewTag && redisClient.del("explore:db_tags"),
    ]);

    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: repo, newTagCreated: isNewTag });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

//@desc 8. Delete workspace or simply delete a repo, this only deletes from DIR not from github
//@route DELETE /api/repos/:id
export const deleteRepo = async (req, res) => {
  try {
    // first need to get the name
    const repo = await Repository.findById(req.params.id);
    const repoName = repo.workspaceName;

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
      redisClient.del(getDiscoveryKey(req.user._id)),
      redisClient.del(`user:stats:${req.user._id}`),
    ]);

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

//@desc 9. Create a new workspace by providing a GitHub repo name and a custom Dir name
//@route POST /api/repos/create-workspace
export const createWorkspace = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { workspaceName, description, githubRepoName } = req.body;

    // we can leave out the workspace
    if (!githubRepoName || !workspaceName) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Workspace name and Repo name are required" });
    }

    // connect to github to verify the repo actually exists under user's account
    const octokit = createGitHubClient(req.user.accessToken);
    const { data: githubRepo } = await octokit.rest.repos.get({
      owner: req.user.githubUsername,
      repo: githubRepoName,
    });

    //create a webhook id for this specific workspace to communicate with the remote repo
    const { webhookId, secret } = await registerWebhook(
      octokit,
      req.user.githubUsername,
      githubRepoName
    );

    // check the import state in dir for the specifc github repo
    const existingRepo = await Repository.findOne({
      githubId: githubRepo.id.toString(),
    });
    if (existingRepo) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "This repository is already connected to a workspace",
      });
    }

    // Create the new Workspace document in repository collection
    const newRepo = await Repository.create(
      [
        {
          githubId: githubRepo.id.toString(),
          githubRepoName: githubRepo.name, // github repo name
          githubOwner: githubRepo.owner.login, // github owner name
          githubFullName: githubRepo.full_name, // owner/repo format
          workspaceName:
            workspaceName && workspaceName.trim() !== ""
              ? workspaceName
              : githubRepo.name,
          description: description || githubRepo.description,
          ownerId: req.user._id,
          url: githubRepo.html_url,
          isPrivate: githubRepo.private,
          language: githubRepo.language,
          webhookSettings: {
            webhookId,
            secret,
            active: true,
          },
          members: [{ userId: req.user._id, role: "owner" }],
          channels: [
            { name: "general", channel_id: new mongoose.Types.ObjectId() },
          ],
        },
      ],
      { session }
    );

    // Update user's list
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reposOwned: newRepo[0]._id } }, //this is to add the number of workspaces owned by user
      { session }
    );

    await createLog(
      req.user._id,
      newRepo[0]._id,
      "created workspace",
      "workspace",
      newRepo[0]._id,
      `Created workspace ${newRepo[0].workspaceName}`
    );

    await Promise.all([
      redisClient.del(getActiveListKey(req.user._id)),
      redisClient.del(getRepoDetailKey(newRepo[0]._id)), // ✅ Fix: Use newRepo[0]._id not req.params._id
      redisClient.del(getDiscoveryKey(req.user._id)),
      redisClient.del(`user:stats:${req.user._id}`),
    ]);

    await session.commitTransaction();
    res
      .status(StatusCodes.CREATED)
      .json({ status: "success", data: newRepo[0] });
  } catch (error) {
    await session.abortTransaction();
    res
      .status(
        error.status === 404
          ? StatusCodes.NOT_FOUND
          : StatusCodes.INTERNAL_SERVER_ERROR
      )
      .json({
        message:
          error.status === 404
            ? "GitHub repository not found under your account"
            : error.message,
      });
  } finally {
    session.endSession();
  }
};

//@desc 10. create a repo directly from dir to github and a workspace for that repo direclt in dir
//@route POST /api/repos/create-remote
export const createRemoteRepo = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, description, isPrivate, auto_init, gitignore_template } =
      req.body;
    if (!name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Repository name is required" });
    }

    const octokit = createGitHubClient(req.user.accessToken);

    //first create the remote repo in github
    const { data: githubRepo } =
      await octokit.rest.repos.createForAuthenticatedUser({
        name,
        description: description || "",
        private: isPrivate === "private",
        auto_init: auto_init === "Yes",
        gitignore_template: gitignore_template == "Yes" ? "Node" : undefined,
      });
    //create a webhook id for this specific workspace to communicate with the remote repo
    const { webhookId, secret } = await registerWebhook(
      octokit,
      req.user.githubUsername,
      githubRepo.name
    );
    //then create the workspace in dir for that repo
    const newRepo = await Repository.create(
      [
        {
          githubId: githubRepo.id.toString(),
          githubRepoName: githubRepo.name,
          githubOwner: githubRepo.owner.login,
          githubFullName: githubRepo.full_name,
          workspaceName: githubRepo.name, //default to the remote name when creating
          description: githubRepo.description,
          ownerId: req.user._id,
          url: githubRepo.html_url,
          isPrivate: githubRepo.private,
          language: githubRepo.language,
          webhookSettings: {
            webhookId,
            secret,
            active: true,
          },
          members: [{ userId: req.user._id, role: "owner" }],
          channels: [
            { name: "general", channel_id: new mongoose.Types.ObjectId() },
          ],
        },
      ],
      { session }
    );

    //update user's worksplace(by default it's called reposOwned)
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { reposOwned: newRepo[0]._id } },
      { session }
    );

    // logging
    await createLog(
      req.user._id,
      newRepo[0]._id,
      "created remote repository",
      "repository",
      newRepo[0]._id,
      `Created new GitHub remote repository ${newRepo[0].githubRepoName} and workspace ${newRepo[0].workspaceName}`
    );

    //cache invalidation
    await redisClient.del(`user:stats:${req.user._id}`);

    // Invalidate other keys safely
    await Promise.all([
      redisClient.del(getActiveListKey(req.user._id)),
      redisClient.del(getRepoDetailKey(newRepo[0]._id)),
      redisClient.del(getDiscoveryKey(req.user._id))
    ]);

    await session.commitTransaction();

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "Repository created successfully",
      data: newRepo[0],
    });
  } catch (error) {
    await session.abortTransaction();
    //here handle github specific errors like if the user name already exists
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;

    let message = error.message;
    if (error.status === 422) {
      message =
        "A repository with this name already exists on your GitHub account";
    }

    res.status(status).json({ status: "error", message });
  } finally {
    session.endSession();
  }
};

//@desc 11. list the repo files and open them both with the same end point for both workspaces and github repos
//@route GET /api/repos/contents
//how to use it: if path is provided in query param then list files in that path else list files in root directory
export const getContents = async (req, res) => {
  try {
    const { workspaceId, owner, repo, path = "" } = req.query;
    const { id: paramId } = req.params;

    let targetOwner = owner;
    let targetRepo = repo;
    const lookupId = paramId || workspaceId;

    //if workspaceId is provided then fetch the repo details from database
    if (lookupId) {
      const workspace = await Repository.findById(lookupId);
      if (!workspace) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: "error", message: "Workspace not found in Dir" });
      }
      targetOwner = workspace.githubOwner;
      targetRepo = workspace.githubRepoName;
    }

    //check if owner and repo are provided
    if (!targetOwner || !targetRepo) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: "error", message: "Owner and Repo name are required" });
    }

    const cacheKey = getRepoContentKey(targetOwner, targetRepo, path);

    // caching
    const results = await getOrSetCache(
      cacheKey,
      async () => {
        const octokit = createGitHubClient(req.user.accessToken);

        try {
          const { data } = await octokit.rest.repos.getContent({
            owner: targetOwner,
            repo: targetRepo,
            path: path,
          });

          if (Array.isArray(data)) {
            // Return a clean object for "directory" type
            return {
              type: "dir",
              files: data.map((item) => ({
                name: item.name,
                path: item.path,
                type: item.type,
                sha: item.sha,
                url: item.html_url,
              })),
            };
          } else {
            // Return a clean object for "file" type
            const decodedContent = Buffer.from(data.content, "base64").toString(
              "utf-8"
            );
            return {
              type: "file",
              fileData: {
                name: data.name,
                path: data.path,
                content: decodedContent,
                size: data.size,
                sha: data.sha,
                downloadUrl: data.download_url,
              },
            };
          }
        } catch (err) {
          // Handle empty repository specifically
          if (err.status === 404 && err.message.includes('empty')) {
            return {
              type: "dir",
              files: [], // Return empty list for empty repo
            };
          }
          throw err; // Re-throw other errors
        }
      },
      120
    );

    return res.status(StatusCodes.OK).json({
      status: "success",
      ...results,
    });
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json({
      status: "error",
      message: error.message || "Failed to fetch repository contents",
    });
  }
};

//@todo: 12. get all languages(or just get repo stats)
// @route GET /api/repos/languages

export const getRepoLanguages = async (req, res) => {
  try {
    const { workspaceId, owner, repo } = req.query;

    let targetOwner = owner;
    let targetRepo = repo;

    //same logic with get content for a workspace or a repo
    if (workspaceId) {
      const workspace = await Repository.findById(workspaceId);
      if (!workspace) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: "error", message: "Workspace not found in Dir" });
      }
      targetOwner = workspace.githubOwner;
      targetRepo = workspace.githubRepoName;
    }

    if (!targetOwner || !targetRepo) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: "error", message: "Owner and Repo name are required" });
    }

    const cacheKey = `repo:languages:${targetOwner.toLowerCase()}:${targetRepo.toLowerCase()}`;

    //caching

    const stats = await getOrSetCache(
      cacheKey,
      async () => {
        const octokit = createGitHubClient(req.user.accessToken);

        let languages = {};
        try {
          //fetch languages from github
          const res = await octokit.rest.repos.listLanguages({
            owner: targetOwner,
            repo: targetRepo,
          });
          languages = res.data;
        } catch (err) {
          // If 404, assumes empty repo => no languages
          if (err.status !== 404) throw err;
          console.warn(`[DEBUG] Languages 404 for ${targetOwner}/${targetRepo} (likely empty repo)`);
          languages = {};
        }

        console.log(`[DEBUG] GitHub Raw Languages Response:`, JSON.stringify(languages));

        //calculate the percentage from each language
        const totalBytes = Object.values(languages).reduce(
          (acc, curr) => acc + curr,
          0
        );

        const formatted = Object.keys(languages).map((lang) => ({
          label: lang,
          value:
            totalBytes > 0
              ? ((languages[lang] / totalBytes) * 100).toFixed(1)
              : 0,
          color: getLanguageColor(lang),
        }));

        console.log(`[DEBUG] Formatted Stats:`, JSON.stringify(formatted));
        return formatted;
      },
      3600
    );

    res.status(StatusCodes.OK).json({ status: "success", data: stats });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: error.message });
  }
};

//@desc 13 update file content and commit to github
//@route PUT /api/repos/:id/contents

export const updateFile = async (req, res) => {
  try {
    const { id: workspaceId } = req.params;
    const { path, content, sha, commitMessage } = req.body;

    //validate the inputs

    if (!path || content === undefined || !sha) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Path, content, and the current file SHA are required.",
      });
    }

    const repo = await Repository.findById(workspaceId);
    if (!repo) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Workspace not found",
      });
    }
    const octokit = createGitHubClient(req.user.accessToken);

    //convert the content to github compatible format
    const base64Content = Buffer.from(content).toString("base64");

    //push to github
    const { data: commitData } =
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: repo.githubOwner,
        repo: repo.githubRepoName,
        path: path,
        message: commitMessage || `Update ${path} via Dir`,
        content: base64Content,
        sha: sha,
      });

    // log this to the activity model
    await createLog(
      req.user._id,
      repo._id,
      "committed changes",
      "file",
      repo._id,
      `Updated file: ${path}`
    );

    // invalidating cache
    const parentPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
    await Promise.all([
      redisClient.del(getRepoContentKey(repo.githubOwner, repo.githubRepoName, path)),
      redisClient.del(getRepoContentKey(repo.githubOwner, repo.githubRepoName, parentPath))
    ]);

    await res.status(StatusCodes.OK).json({
      status: "success",
      message: "File successfully committed to Github",
      data: {
        sha: commitData.content.sha,
        commit: commitData.commit.html_url,
      },
    });
  } catch (err) {
    //handle version conflicts (409)
    if (err.status === 409) {
      return res.status(StatusCodes.CONFLICT).json({
        message:
          "Conflict: The file has been modified on gitHub. Please refresh",
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

//@desc 14 Delete a file from the repository
//@route DELETE /api/repos/:id/contents
export const deleteFile = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const { path, sha, commitMessage } = req.body;

    if (!path || !sha) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "File path and the current SHA are required to delete a file.",
      });
    }

    const repo = await Repository.findById(workspaceId);
    if (!repo) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Workspace not found in Dir Database",
      });
    }

    const octokit = createGitHubClient(req.user.accessToken);

    //delete the file
    const { data: deletedData } = await octokit.rest.repos.deleteFile({
      owner: repo.githubOwner,
      repo: repo.githubRepoName,
      path: path,
      message: commitMessage || `Deleted ${path} via Dir`,
      sha: sha,
    });

    const parentPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
    // invalidate cache for the parent directory (listing) and the specific file (if any content cache exists)
    await Promise.all([
      redisClient.del(getRepoContentKey(repo.githubOwner, repo.githubRepoName, path)),
      redisClient.del(getRepoContentKey(repo.githubOwner, repo.githubRepoName, parentPath))
    ]);

    //log activity
    await createLog(
      req.user._id,
      repo._id,
      "deleted file",
      "file",
      repo._id,
      `Removed file: ${path}`
    );

    res.status(StatusCodes.OK).json({
      status: "success",
      message: "File successfully deleted from Github",
      data: {
        commit: deletedData.commit.html_url,
      },
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(StatusCodes.CONFLICT).json({
        message:
          "Conflict: The file SHA is outdated. Someone else may have edited it.",
      });
    }
    if (err.status === 404) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "File not found on GitHub. It may have already been deleted.",
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    });
  }
};

//@desc 15 Create a new file in the repository(also in the workspace it's the same)
//@route POST /api/repos/:id/contents
export const createFile = async (req, res) => {
  try {
    const { id: workspaceId } = req.params;
    const { path, content, commitMessage } = req.body;

    // validate the reqiuest
    if (!path || content === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "File path and content are required to create a new file.",
      });
    }

    const repo = await Repository.findById(workspaceId);
    if (!repo) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Workspace not found.",
      });
    }

    const octokit = createGitHubClient(req.user.accessToken);

    // Encode content to Base64 needed for github api
    const base64Content = Buffer.from(content).toString("base64");

    // Push to GitHub
    const { data: createdData } =
      await octokit.rest.repos.createOrUpdateFileContents({
        owner: repo.githubOwner,
        repo: repo.githubRepoName,
        path: path,
        message: commitMessage || `Created ${path} via Dir`,
        content: base64Content,
      });

    const parentPath = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '';
    // invalidate cache for the parent directory so the new file shows up in the list
    await redisClient.del(getRepoContentKey(repo.githubOwner, repo.githubRepoName, parentPath));

    // Log the creation
    await createLog(
      req.user._id,
      repo._id,
      "created file",
      "file",
      repo._id,
      `Added new file: ${path}`
    );

    res.status(StatusCodes.CREATED).json({
      status: "success",
      message: "File successfully created",
      data: {
        sha: createdData.content.sha,
        url: createdData.content.html_url,
      },
    });
  } catch (err) {
    //file alredy exists
    if (err.status === 422) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "A file with this name already exists at this path.",
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message });
  }
};
