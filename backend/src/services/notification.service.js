import { Notification } from "../models/notification.model.js";
import { getIO } from "../sockets/socket.js";
import { createLog } from "../utils/activity.util.js";

export const createNotification = async ({ userId, message, type, repoId, targetType, targetId }) => {
    try {
        const notification = await Notification.create({
            userId,
            message,
            type,
            repoId,
            targetType,
            targetId,
        });

        // emmitting to the user's private socket room
        console.log(`Emitting notification to room user:${userId}:`, message);
        getIO().to(`user:${userId}`).emit("new_notification", notification);

        // logging (as requested: new_notification activity)
        await createLog(
            userId,
            repoId,
            "received notification",
            "notification",
            notification._id,
            `Received notification: ${message}`
        );

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw new Error("Failed to create notification")
    }
}