import express from "express";
import * as channelController from "../controllers/channel.controller.js";
import {checkWorkspacePermission} from "../middlewares/role.middleware.js";
import messageRouter from "../routes/message.routes.js";

//mergeParams is required because :repoId is in parent folde
const channelRouter = express.Router({mergeParams:true});


// @route: /api/repos/:repoId/channels
channelRouter.get("/", checkWorkspacePermission("viewer"), channelController.listChannels);
channelRouter.post("/", checkWorkspacePermission("owner"), channelController.createChannel);


// @route: /api/repos/:repoId/channels/:id
channelRouter.patch("/:id", checkWorkspacePermission("owner"), channelController.updateChannel);
channelRouter.delete("/:id", checkWorkspacePermission("owner"), channelController.deleteChannel);


// @route: /api/repos/:repoId/channels/:id/join and /leave

channelRouter.post("/:id/join", checkWorkspacePermission("viewer"), channelController.joinChannel);
channelRouter.post("/:id/leave", checkWorkspacePermission("viewer"), channelController.leaveChannel);

// mounting messages routes 
channelRouter.use("/:channelId/messages", messageRouter);


export default channelRouter;
