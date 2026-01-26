import { Repository } from "../models/repository.model.js";
import { Message } from "../models/message.model.js";
import { StatusCodes } from "http-status-codes";
import { getIO } from "../sockets/socket.js";
import { createLog } from "../utils/activity.util.js";
import mongoose from "mongoose";


// @desc: creating a channel
// @route:POST  /api/repos/:repoId/channels
export const createChannel = async (req, res) => {
    try {
        const { repoId: workspaceId } = req.params;
        const { name, isPrivate, participants } = req.body; // Extract isPrivate and participants

        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Channel name is required" });
        }

        // Generate a new ObjectId for the channel_id field
        const newChannelData = {
            channel_id: new mongoose.Types.ObjectId(),
            name: name.trim(),
            isPrivate: !!isPrivate,
            participants: isPrivate
                ? [req.user._id, ...(participants || []).map(id => new mongoose.Types.ObjectId(id))] // Auto-add creator + selected members
                : []
        };

        const workspace = await Repository.findByIdAndUpdate(
            workspaceId,
            { $push: { channels: newChannelData } },
            { new: true }
        ).select("channels workspaceName");

        if (!workspace) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });
        }

        // finding the channel from the array
        const createdChannel = workspace.channels.find(
            c => c.channel_id.toString() === newChannelData.channel_id.toString()
        );

        // emitting Real-time notification
        // For private channels, we might only want to emit to specific people, 
        // but emitting to the workspace is generally okay as the frontend will filter/not show it 
        // OR the user just won't be able to access it. 
        // Sticking to workspace emission for simplicity, but ideally we'd target specific users.
        // However, standard specific-user emission is complex without a list of socket IDs.
        // Since we are adding RBAC to listChannels, other users won't see it on refresh.
        // To be safe, let's keep it.
        getIO().to(`workspace:${workspaceId}`).emit("new_channel", {
            workspaceId,
            channel: createdChannel,
        });

        // logging
        await createLog(
            req.user._id,
            workspace._id,
            "created channel",
            "channel",
            createdChannel.channel_id,
            `Created ${isPrivate ? 'private ' : ''}channel ${createdChannel.name}`
        );

        res.status(StatusCodes.CREATED).json({
            status: "success",
            data: createdChannel
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

//@route: GET /api/repos/:repoId/channels
//@desc: listing all channels
export const listChannels = async (req, res) => {
    try {
        const { repoId } = req.params;
        const userId = req.user._id.toString();

        const workspace = await Repository.findById(repoId).select("channels");

        if (!workspace) return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found" });

        // RBAC Filter: Public channels OR Private channels where user is a participant
        const visibleChannels = workspace.channels.filter(ch => {
            if (!ch.isPrivate) return true;
            return ch.participants.some(p => p.toString() === userId);
        });

        res.status(StatusCodes.OK).json({ status: "success", data: visibleChannels });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @route: PATCH /api/repos/:repoId/channels/:id
// @desc: updating a channel
export const updateChannel = async (req, res) => {
    try {
        const { id: channelId } = req.params;
        const { name } = req.body;

        // Use positional operator $ to find repo containing the channel
        // Using channel_id to match your specific schema definition
        const workspace = await Repository.findOneAndUpdate(
            { "channels.channel_id": channelId },
            { $set: { "channels.$.name": name.trim() } },
            { new: true }
        );

        if (!workspace) return res.status(StatusCodes.NOT_FOUND).json({ message: "Channel not found" });

        // Extract the updated channel to return to the client
        const updatedChannel = workspace.channels.find(c => c.channel_id.toString() === channelId.toString());

        // Broadcast to workspace room so sidebars update for everyone
        getIO().to(`workspace:${workspace._id}`).emit("channel_updated", {
            workspaceId: workspace._id,
            channel: updatedChannel
        });

        // logging
        await createLog(
            req.user._id,
            workspace._id,
            "updated channel",
            "channel",
            channelId,
            `Renamed channel to ${updatedChannel.name}`
        );

        res.status(StatusCodes.OK).json({ status: "success", data: updatedChannel });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @route: DELETE /api/repos/:repoId/channels/:id
// @desc: deleting  a channel

export const deleteChannel = async (req, res) => {
    try {
        const { id: channelId } = req.params;

        // 1. Find repo first to get channel details (name) for logging/response
        // We do this BEFORE deletion so we don't lose the name
        const workspaceCheck = await Repository.findOne(
            { "channels.channel_id": channelId },
            { "channels.$": 1, _id: 1 }
        );

        if (!workspaceCheck || !workspaceCheck.channels || workspaceCheck.channels.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Channel not found" });
        }

        const channelToDelete = workspaceCheck.channels[0];
        const channelName = channelToDelete.name;

        // 2. Perform Deletion
        const workspace = await Repository.findByIdAndUpdate(
            workspaceCheck._id,
            { $pull: { channels: { channel_id: channelId } } },
            { new: true }
        );

        // Clean up orphaned messages
        await Message.deleteMany({ channelId: channelId });

        // logging
        await createLog(
            req.user._id,
            workspace._id,
            "deleted channel",
            "channel",
            channelId,
            `Deleted channel ${channelName}`
        );

        // Broadcast deletion
        getIO().to(`workspace:${workspace._id}`).emit("channel_deleted", {
            workspaceId: workspace._id,
            channelId: channelId
        });

        res.status(StatusCodes.OK).json({ status: "success", message: `Channel ${channelName} and messages deleted` });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @desc: joining the channel
// @route: POST /api/repos/:repoId/channels/:id/join

export const joinChannel = async (req, res) => {
    try {
        const { id: channelId } = req.params;
        const userId = req.user._id;

        // 1. Join Requested Channel
        let workspace = await Repository.findOneAndUpdate(
            { "channels.channel_id": channelId },
            { $addToSet: { "channels.$.participants": userId } }, // Add to target channel
            { new: true }
        );

        if (!workspace) return res.status(StatusCodes.NOT_FOUND).json({ message: "Channel not found" });

        const targetChannel = workspace.channels.find(c => c.channel_id.toString() === channelId);

        // RBAC Check: Cannot publicly join a private channel
        if (targetChannel.isPrivate) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Cannot join private channel directly. Use invitation." });
        }

        // 2. Join 'General' Channel (if target is not already general)
        if (targetChannel.name !== "general") {
            // We use a second query to specifically target the 'general' channel within this workspace
            // This is simpler than arrayFilters for readability
            workspace = await Repository.findOneAndUpdate(
                { _id: workspace._id, "channels.name": "general" },
                { $addToSet: { "channels.$.participants": userId } },
                { new: true }
            );
        }

        // logging
        await createLog(
            req.user._id,
            workspace._id,
            "joined channel",
            "channel",
            channelId,
            `Joined channel ${targetChannel.name}`
        );

        // 3. Emit Events

        // Emit for Target Channel
        getIO().to(`workspace:${workspace._id}:channel:${channelId}`).emit("user_joined_channel", {
            channelId,
            userId,
            user: { _id: req.user._id, username: req.user.githubUsername, avatarUrl: req.user.avatarUrl }
        });

        // Emit for General Channel (Logic: If we joined general implicitly, notify general room too)
        if (targetChannel.name !== "general") {
            const generalChannel = workspace.channels.find(c => c.name === "general");
            if (generalChannel) {
                getIO().to(`workspace:${workspace._id}:channel:${generalChannel.channel_id}`).emit("user_joined_channel", {
                    channelId: generalChannel.channel_id,
                    userId,
                    user: { _id: req.user._id, username: req.user.githubUsername, avatarUrl: req.user.avatarUrl }
                });
            }
        }

        res.status(StatusCodes.OK).json({
            status: "success",
            message: `Successfully joined ${targetChannel.name} (and general)`,
            // data: workspace.channels
        });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

//@desc: leaving the channel
// @route: POST /api/repos/:repoId/channels/:id/leave

export const leaveChannel = async (req, res) => {
    try {
        const { id: channelId } = req.params;
        const userId = req.user._id;

        // Remove user from participants array
        const repo = await Repository.findOneAndUpdate(
            { "channels.channel_id": channelId },
            { $pull: { "channels.$.participants": userId } },
            { new: true }
        );

        if (!repo) return res.status(StatusCodes.NOT_FOUND).json({ message: "Channel not found" });

        // logging
        await createLog(
            req.user._id,
            repo._id,
            "left channel",
            "channel",
            channelId,
            `Left channel`
        );

        // Emit leave event
        const roomName = `workspace:${repo._id}:channel:${channelId}`;
        getIO().to(roomName).emit("user_left_channel", {
            channelId,
            userId,
            user: {
                _id: req.user._id,
                username: req.user.githubUsername
            }
        });

        res.status(StatusCodes.OK).json({
            status: "success",
            message: `Successfully left the channel`
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};