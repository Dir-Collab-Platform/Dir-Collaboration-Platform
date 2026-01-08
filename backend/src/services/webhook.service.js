import crypto from "crypto";

export const registerWebhook = async (octokit, owner, repoName) => {
  const secret = crypto.randomBytes(20).toString("hex");

  const { data: webhook } = await octokit.rest.repos.createWebhook({
    owner: owner,
    repo: repoName,
    config: {
      url: `${process.env.BASE_URL}/api/webhooks/github`,
      content_type: "json",
      secret: secret,
    },
    events: ["push", "pull_request", "issues", "star"],
    active: true,
  });

  return { webhookId: webhook.id.toString(), secret };
};
