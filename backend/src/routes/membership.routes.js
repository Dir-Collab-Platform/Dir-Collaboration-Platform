
import express from "express";
import * as membershipController from "../controllers/membership.controller.js";
import { checkWorkspacePermission } from "../middlewares/role.middleware.js";


const memberRouter = express.Router({ mergeParams: true });

// Route: /api/repos/:repoId/members

memberRouter.get("/", checkWorkspacePermission("viewer"), membershipController.listMembers);
memberRouter.post("/", checkWorkspacePermission("core"), membershipController.inviteMember);

// route: /api/repos/:repoId/members/:userId
memberRouter.patch("/:userId", checkWorkspacePermission("core"), membershipController.updateRole);
memberRouter.delete("/:userId", checkWorkspacePermission("core"), membershipController.removeMember);

export default memberRouter;