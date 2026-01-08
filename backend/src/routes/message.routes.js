import express from "express";
import * as messageController from "../controllers/message.controller.js";
import {checkWorkspacePermission} from "../middlewares/role.middleware.js";

//mergeParams is required because :repoId is in parent folde
const messageRouter = express.Router({mergeParams:true});


// @route: /api/repos/:repoId/channels/:channelId/messages
messageRouter.get("/", checkWorkspacePermission("viewer"), messageController.getMessages);
messageRouter.post("/", checkWorkspacePermission("viewer"), messageController.sendMessage);

// @route : /api/repos/:repoId/channels/:channelId/messages/:id/reactions - mounted at channel routes
messageRouter.put("/:id/reactions", checkWorkspacePermission("viewer"), messageController.addReaction);

// @route : /api/repos/:repoId/channels/:channelId/messages/:id - mounted at channel routes
messageRouter.delete("/:id", checkWorkspacePermission("viewer"), messageController.deleteMessage);

export default messageRouter;

