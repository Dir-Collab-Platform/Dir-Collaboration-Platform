import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js"; // Added for mention lookup
import { StatusCodes } from "http-status-codes";
import { getIO } from "../sockets/socket.js";
import { createNotification } from "../services/notification.service.js";
import { Repository } from "../models/repository.model.js";
import { createLog } from "../utils/activity.util.js";



// @desc Send a message (Standard + Socket)
// @route POST /api/repos/:repoId/channels/:channelId/messages
export const sendMessage = async (req, res) => {
    try {
        const { repoId, channelId } = req.params;
        const { content, attachments } = req.body;
        const userId = req.user._id;

        // 1. RBAC & Existence Check (Fetch Repo First)
        // We find the repo to get the participant list for this specific channel
        const repo = await Repository.findOne({ "channels.channel_id": channelId });
        if (!repo) return res.status(StatusCodes.NOT_FOUND).json({ message: "Repository/Channel not found" });

        const channel = repo.channels.find(c => c.channel_id.toString() === channelId);
        if (!channel) return res.status(StatusCodes.NOT_FOUND).json({ message: "Channel not found" });

        // PERMISSION CHECK: If private, user MUST be a participant
        if (channel.isPrivate) {
            const isParticipant = channel.participants.some(p => p.toString() === userId.toString());
            if (!isParticipant) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not a participant of this private channel" });
            }
        }

        //  Create message
        const newMessage = await Message.create({
            channelId,
            senderId: userId,
            content,
            attachments: attachments || [],
        });

        //  Populate for UI 
        const populatedMessage = await newMessage.populate("senderId", "githubUsername avatarUrl");

        //  Handle Mentions Logic (Username to ID conversion)
        const mentionRegex = /@([\w-]+)/g;
        const mentionedUsernames = [...content.matchAll(mentionRegex)].map(match => match[1]);
        let mentionedUserIds = [];

        if (mentionedUsernames.length > 0) {
            // Find the actual User documents to get their IDs
            const mentionedUsers = await User.find({ githubUsername: { $in: mentionedUsernames } }).select("_id");
            mentionedUserIds = mentionedUsers.map(u => u._id.toString());

            // Persistent Notifications for found users
            await Promise.all(mentionedUsers.map(targetUser =>
                createNotification({
                    userId: targetUser._id, // Now using the real ID
                    message: `${req.user.githubUsername} mentioned you in a message`,
                    type: "mention",
                    repoId: repoId,
                    targetType: "message",
                    targetId: newMessage._id
                })
            ));

            // Log the mention activity
            await createLog(
                userId,
                repoId,
                "mentioned user",
                "message",
                newMessage._id,
                `Mentioned ${mentionedUsernames.join(", ")} in a message`
            );
        }

        // Handle General Participant Notifications
        // We already have 'channel' from the top check
        if (channel && channel.participants.length > 0) {
            // Notify participants who WERE NOT already mentioned and are NOT the sender
            const usersToNotify = channel.participants.filter(pId =>
                pId.toString() !== userId.toString() &&
                !mentionedUserIds.includes(pId.toString())
            );

            await Promise.all(usersToNotify.map(pId =>
                createNotification({
                    userId: pId,
                    message: `New message in ${channel.isPrivate ? 'private channel ' : '#'}${channel.name}`,
                    type: "message",
                    repoId: repoId,
                    targetType: "message",
                    targetId: newMessage._id
                })
            ));
        }

        //  Broadcast to Specific Socket Room (Emit the populated version!)
        const roomName = `workspace:${repoId}:channel:${channelId}`;
        getIO().to(roomName).emit("message_received", populatedMessage);

        res.status(StatusCodes.CREATED).json({ status: "success", data: populatedMessage });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @desc Get history with pagination
// @route GET /api/repos/:repoId/channels/:channelId/messages
export const getMessages = async (req, res) => {
    try {
        const { channelId, repoId } = req.params; // repoId assumed in params
        const { limit = 50, offset = 0 } = req.query;
        const userId = req.user._id;

        // 1. RBAC Check
        // We need to look up privacy settings first. 
        // Optimized query: Select only the channels array
        const repo = await Repository.findOne(
            { "channels.channel_id": channelId },
            { "channels.$": 1 }
        );

        if (!repo || !repo.channels || repo.channels.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Channel not found" });
        }

        const channel = repo.channels[0]; // Projection returns only matching element

        if (channel.isPrivate) {
            const isParticipant = channel.participants.some(p => p.toString() === userId.toString());
            if (!isParticipant) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied to private channel" });
            }
        }

        const messages = await Message.find({ channelId })
            .sort({ createdAt: -1 })
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .populate("senderId", "githubUsername avatarUrl")
            .populate("reactions.userId", "githubUsername")
            .lean(); // Use lean for better performance on read history

        // Return in chronological order (Oldest -> Newest)
        const chronologicalMessages = messages.reverse();

        res.status(StatusCodes.OK).json({
            status: "success",
            data: chronologicalMessages,
            count: chronologicalMessages.length
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};


// @desc Add/Toggle Reaction
// @route PUT /api/messages/:id/reactions
export const addReaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { emoji, repoId } = req.body;
        const userId = req.user._id;

        // 1. Check if user already reacted with this emoji
        const existingMessage = await Message.findById(id);
        if (!existingMessage) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Message not found" });
        }

        const alreadyReacted = existingMessage.reactions.find(
            (r) => r.userId.toString() === userId.toString() && r.emoji === emoji
        );

        let updatedMessage;

        if (alreadyReacted) {
            // TOGGLE OFF: Remove the reaction if it exists
            updatedMessage = await Message.findByIdAndUpdate(
                id,
                { $pull: { reactions: { userId, emoji } } }, // removing
                { new: true }
            ).populate("reactions.userId", "githubUsername");
        } else {
            // TOGGLE ON: Add the reaction
            updatedMessage = await Message.findByIdAndUpdate(
                id,
                { $push: { reactions: { emoji, userId } } },
                { new: true }
            ).populate("reactions.userId", "githubUsername");
        }

        // 2. Broadcast Update
        // Use repoId from body and channelId from the message document
        const roomName = `workspace:${repoId}:channel:${updatedMessage.channelId}`;

        // Strategy: Emit the whole message OR just the reactions array
        // Here we emit a "reaction_update" event so the frontend knows exactly what changed
        getIO().to(roomName).emit("reaction_update", {
            messageId: updatedMessage._id,
            reactions: updatedMessage.reactions
        });

        res.status(StatusCodes.OK).json({
            status: "success",
            data: updatedMessage.reactions
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @desc Delete a message
// @route DELETE /api/repos/:repoId/channels/:channelId/messages/:id
export const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(id);

        if (!message) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Message not found" });
        }

        // Authorization: Only sender can delete (or you could add admin check logic here)
        // Ensure to turn ObjectId to string for comparison
        if (message.senderId.toString() !== userId.toString()) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to delete this message" });
        }

        // Hard Delete
        await Message.findByIdAndDelete(id);

        // Broadcast Deletion to the Channel Room
        // We need the repoId to reconstruct the room name. It might be in params if nested, 
        // or we usually might need to look it up if this is a flat route.
        // Assuming your Repository model structure or if you pass repoId in params:
        const { repoId } = req.params; // If route is nested /repos/:repoId/...

        if (repoId) {
            const roomName = `workspace:${repoId}:channel:${message.channelId}`;
            getIO().to(roomName).emit("message_deleted", { messageId: id });
        }

        res.status(StatusCodes.OK).json({ status: "success", message: "Message deleted" });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
