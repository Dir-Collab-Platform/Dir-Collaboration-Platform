import express from "express";
import { handleGithubWebhook } from "../controllers/webhook.controller.js";
const webhookRouter = express.Router();

//separated this out of repository as we don't need it to be protected route and the repoRouter.use(authMiddleware) does that
webhookRouter.post("/github", handleGithubWebhook);

export default webhookRouter;