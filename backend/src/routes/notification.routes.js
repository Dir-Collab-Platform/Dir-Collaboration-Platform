import express from "express";
import * as notificationControllers from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const notificationRouter = express.Router();

notificationRouter.use(authMiddleware); // ensuring login

notificationRouter.get("/", notificationControllers.getNotifications);
notificationRouter.put("/preferences", notificationControllers.updatePreferences);
notificationRouter.patch("/:id/read", notificationControllers.markAsRead);
notificationRouter.delete("/:id", notificationControllers.deleteNotification);
notificationRouter.patch("/:id/read", notificationControllers.markAsRead);


export default notificationRouter;