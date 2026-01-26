import { User } from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import { Repository } from "../models/repository.model.js";
import { createLog } from "../utils/activity.util.js";
import { createNotification } from "../services/notification.service.js";
import { toObjectId } from "../utils/objectId.util.js";
import { getIO } from "../sockets/socket.js";
import { invalidateWorkspaceStatsCache, getActiveListKey, invalidateRepoCache } from "../utils/cache.util.js";
import redisClient from "../config/redis.js";

//@route /api/repos/:repoId/members
//@desc inviting a member
export const inviteMember = async (req, res) => {
  try {
    //  Fix: Cast to ObjectId
    const workspaceId = toObjectId(
      req.params.id || req.params.repoId,
      "Workspace ID"
    );
    const { githubUsername, role = "viewer" } = req.body;

    // the invited user must logged into dir
    const invitedUser = await User.findOne({ githubUsername });
    if (!invitedUser)
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "User not found",
      });

    // looking for workspace that doesn't have the invited user

    const workspace = await Repository.findOneAndUpdate(
      { _id: workspaceId, "members.userId": { $ne: invitedUser._id } },
      { $push: { members: { userId: invitedUser._id, role } } },
      { new: true }
    ).populate("members.userId", "githubUsername avatarUrl email");

    if (!workspace) {
      // If workspace is null, it's either a wrong ID or the user is already a member
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message:
          "Invitation failed: Either workspace not found or user is already a member",
      });
    }




    // persist and emit
    await createNotification({
      userId: invitedUser._id,
      message: `${req.user.githubUsername} added you to ${workspace.workspaceName}`,
      type: "message",
      repoId: workspaceId.toString(), //  Convert to string for notification
      targetType: "repository",
      targetId: workspaceId.toString(), //  Convert to string for notification
    });

    // logging
    await createLog(
      req.user._id,
      workspace._id,
      "invited member",
      "user",
      invitedUser._id,
      `Invited ${githubUsername} as ${role} to join the workspace`
    );

    // Invalidate caches for the invited user so their Dashboard and Workspaces page update
    await invalidateWorkspaceStatsCache(invitedUser._id);
    await redisClient.del(getActiveListKey(invitedUser._id));

    // Invalidate repository cache (covers repo details for everyone and discovery/lists for inviter)
    await invalidateRepoCache(req.user._id, workspaceId);

    // Emit socket event to notify the invited user to refresh their dashboard
    getIO().to(`user:${invitedUser._id}`).emit("stats_updated", {
      message: "Dashboard stats updated",
      repositoryId: workspace._id,
      repositoryName: workspace.workspaceName,
      reason: "invited_to_workspace"
    });

    res.status(StatusCodes.OK).json({
      status: "success",
      message: `User ${githubUsername} invited`,
      data: workspace.members, // Send back fully populated objects
    });

  } catch (error) {
    // Handle validation errors
    if (
      error.message.includes("Invalid") ||
      error.message.includes("required")
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: error.message,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// @desc list all members
// @route GET /api/repos/:repoId/members - todo
export const listMembers = async (req, res) => {
  try {
    //  Fix: Cast to ObjectId (findById auto-casts, but validate for consistency)
    const repoId = toObjectId(
      req.params.repoId || req.params.id,
      "Repository ID"
    );
    // Find the repository and populate the members array with user details
    const workspace = await Repository.findById(repoId)
      .populate("members.userId", "githubUsername avatarUrl email")
      .select("members workspaceName");



    if (!workspace)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Workspace not found" });

    // Filter out any null userIds
    workspace.members = workspace.members.filter(member => member.userId !== null);

    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: workspace.members });
  } catch (error) {
    // Handle validation errors
    if (
      error.message.includes("Invalid") ||
      error.message.includes("required")
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: error.message,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// @desc updating role
//@route PATCH /api/repos/:repoId/members/:userId
export const updateRole = async (req, res) => {
  try {
    //  Fix: Cast both to ObjectId
    const repoId = toObjectId(
      req.params.repoId || req.params.id,
      "Repository ID"
    );
    const memberIdToUpdate = toObjectId(req.params.userId, "User ID");
    const { role } = req.body;

    // Match the membership schema's enum exactly
    const validRoles = ["owner", "maintainer", "contributor", "viewer"];

    if (!validRoles.includes(role)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid role specified" });
    }

    // finding workspace to be updated

    const workspace = await Repository.findOneAndUpdate(
  { _id: repoId, "members.userId": memberIdToUpdate },
  { $set: { "members.$.role": role } },
  { new: true }
).populate("members.userId", "githubUsername avatarUrl email") // ADD THIS
 .select("members workspaceName");

    if (!workspace)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Member not found in this workspace" });

    await createNotification({
      userId: memberIdToUpdate,
      message: `Your role in ${workspace.workspaceName} was updated to ${role}`,
      type: "message",
      repoId: repoId.toString(), //  Convert to string for notification
      targetType: "repository",
      targetId: repoId.toString(), //  Convert to string for notification
    });

    res
      .status(StatusCodes.OK)
      .json({ status: "success", data: workspace.members });
  } catch (error) {
    // Handle validation errors
    if (
      error.message.includes("Invalid") ||
      error.message.includes("required")
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: error.message,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// @desc evicting the member lol
// @route DELETE /api/repos/:repoId/members/:userId
// removeMember function updates
export const removeMember = async (req, res) => {
  try {
    const repoId = toObjectId(
      req.params.repoId || req.params.id,
      "Repository ID"
    );
    const memberIdToRemove = toObjectId(req.params.userId, "User ID");

    // Security check: Find repo first to ensure we aren't removing the last owner
    const workspaceCheck = await Repository.findById(repoId);
    if (!workspaceCheck)
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Workspace not found" });

    const member = workspaceCheck.members.find(
      (m) => m.userId.toString() === memberIdToRemove.toString()
    );
    if (member?.role === "owner") {
      const ownerCount = workspaceCheck.members.filter(
        (m) => m.role === "owner"
      ).length;
      if (ownerCount <= 1) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Cannot remove the last owner of a workspace" });
      }
    }

    const updatedWorkspace = await Repository.findByIdAndUpdate(
      repoId,
      { $pull: { members: { userId: memberIdToRemove } } },
      { new: true }
    );

    await createLog(
      req.user._id,
      repoId,
      "removed member",
      "user",
      memberIdToRemove,
      "Removed user from workspace"
    );

    // Invalidate caches
    // 1. Clear repo details (so fetches show updated member list)
    // 2. Clear discovery/active lists for the user performing the action
    await invalidateRepoCache(req.user._id, repoId);

    // 3. Specific invalidation for the removed user
    await invalidateWorkspaceStatsCache(memberIdToRemove);
    await redisClient.del(getActiveListKey(memberIdToRemove));

    // Emit socket event to notify the removed user to refresh their dashboard
    getIO().to(`user:${memberIdToRemove}`).emit("stats_updated", {
      message: "Dashboard stats updated",
      repositoryId: repoId,
      repositoryName: updatedWorkspace.workspaceName,
      reason: "removed_from_workspace"
    });
    const finalWorkspace = await Repository.findById(repoId)
  .populate("members.userId", "githubUsername avatarUrl email")
  .select("members");
    res
      .status(StatusCodes.OK)
      .json({
        status: "success",
        message: "Member removed",
        data: finalWorkspace.members
      });
  } catch (error) {
    if (
      error.message.includes("Invalid") ||
      error.message.includes("required")
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: error.message,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
