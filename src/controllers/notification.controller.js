import { StatusCodes } from "http-status-codes";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";

// @route GET /api/notifications
export const getNotifications = async (req, res) => {
    try {
        // Fetch unread first, then read, sorted by newest
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ isRead: 1, createdAt: -1 }) 
            .limit(50)
            .populate("repoId", "workspaceName") // Added to provide context in UI
            .lean();

        res.status(StatusCodes.OK).json({ status: "success", data: notifications });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @route PATCH /api/notifications/:id/read
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        // SECURITY: Ensure the notification belongs to the requester
        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user._id }, 
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Notification not found or unauthorized" });
        }

        res.status(StatusCodes.OK).json({ status: "success", data: notification });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @route DELETE /api/notifications/:id
export const deleteNotification = async (req, res) => {
    try {
        // SECURITY: Ensure the notification belongs to the requester
        const result = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });

        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Notification not found or unauthorized" });
        }

        res.status(StatusCodes.OK).json({ status: "success", message: "Notification deleted" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// @desc    Update user UI and notification preferences
// @route   PUT /api/notifications/preferences
export const updatePreferences = async (req, res) => {
    try {
        const { notificationsEnabled, emailNotifications, theme } = req.body;
        
        // Construct dynamic update object using MongoDB dot notation
        const updateData = {};
        
        if (notificationsEnabled !== undefined) {
            updateData["preferences.notificationsEnabled"] = notificationsEnabled;
        }
        
        if (emailNotifications !== undefined) {
            updateData["preferences.emailNotifications"] = emailNotifications;
        }
        
        if (theme !== undefined) {
            // Mongoose will automatically validate the enum ["light", "dark", "system"]
            updateData["preferences.theme"] = theme;
        }

        // Validate that there is actually something to update
        if (Object.keys(updateData).length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ 
                message: "No valid preference fields provided for update" 
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { 
                new: true, 
                runValidators: true // This ensures the 'theme' enum is checked
            }
        ).select("preferences");

        res.status(StatusCodes.OK).json({ 
            status: "success", 
            data: user.preferences 
        });
    } catch (error) {
        // Catch validation errors (e.g., if theme is not in the enum)
        if (error.name === 'ValidationError') {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};