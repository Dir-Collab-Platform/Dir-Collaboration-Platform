import redisClient from "../config/redis.js";
import { toObjectIdString } from "./objectId.util.js";

export const getOrSetCache = async (key, cb, ttl = 3600) => {
  try {
    // trying to get data from Redis
    const cachedData = await redisClient.get(key);

    if (cachedData) {
      //Cache Hit Scenario
      return JSON.parse(cachedData) // ✅ ObjectIds are now strings (expected)
    }

    // cache miss sceanario
    const freshData = await cb();

    // storing the result in redis with expiration
    if (freshData) {
      await redisClient.setEx(key, ttl, JSON.stringify(freshData)) // ✅ ObjectIds stringified (expected)
    }

    return freshData;
  } catch (error) {
    console.error("Redis Cache Error: ", error)
    return await cb(); // returning to db 
  }
}

//added this to handle cache invalidation specifically for webhook events
// ✅ Fix: Use toObjectIdString to ensure consistent string conversion
export const getDiscoveryKey = (userId) => `repos:discovery:${toObjectIdString(userId)}`;
export const getActiveListKey = (userId) => `repos:active:${toObjectIdString(userId)}`;
export const getRepoDetailKey = (repoId) => `repos:detail:${toObjectIdString(repoId)}`;

//wipe all internal cache when webhook request a push request
//also as the changes affect the users discovery and active repos list we will also invalidate the cache
export const invalidateRepoCache = async (userId, repoId) => {
  const keys = [getRepoDetailKey(repoId)];

  if (userId) {
    keys.push(getDiscoveryKey(userId));
    keys.push(getActiveListKey(userId));
  }

  try {
    await redisClient.del(keys);
  } catch (err) {
    console.error("Cache Invalidation Error:", err);
  }
};

export const getRepoContentKey = (owner, repo, path) =>
  `repo:content:${(owner || "").toLowerCase()}:${(repo || "").toLowerCase()}:${path || ""}`;