import { apiRequest } from '../../../services/api/api';
import languageColors from './languageColors';

// 1. Explore Public Repos
export const fetchExploreRepos = async (page = 1, query = "", tag = "", filter = "all") => {
  try {
    const response = await apiRequest('/api/repos/explore', {
      params: {
        page,
        q: query,
        tag: tag === "all" ? "" : tag, // Handle "all" filter
        filter: filter,
        limit: 6
      }
    });

    // The backend returns { status: 'success', data: { repos: [], total: ... } }
    // Or depending on explore.controller implementation:
    // It returns res.json({ status: "success", data: { total, repos, hasNextPage } })

    if (response.status === 'success') {
      return {
        status: 'success',
        data: response.data
      };
    }
    throw new Error(response.message || "Failed to fetch repositories");
  } catch (error) {
    console.error("fetchExploreRepos error:", error);
    throw error;
  }
};

// 2. Fetch Topics (Curated + Custom)
export const fetchTopics = async () => {
  try {
    const response = await apiRequest('/api/repos/topics');
    return response;
  } catch (error) {
    console.error("fetchTopics error:", error);
    throw error;
  }
};

// 3. Create Remote Repository
export const createRemoteRepo = async (repoData) => {
  try {
    const response = await apiRequest('/api/repos/create-remote', {
      method: 'POST',
      body: repoData
    });
    return response;
  } catch (error) {
    console.error("createRemoteRepo error:", error);
    throw error;
  }
};

// 4. Create Custom Tag (Topic)
export const createCustomTag = async (tagName, tagDescription, tagColor) => {
  try {
    const response = await apiRequest('/api/repos/topics', {
      method: 'POST',
      body: {
        name: tagName,
        description: tagDescription,
        color: tagColor
      }
    });
    return response;
  } catch (error) {
    console.error("createCustomTag error:", error);
    throw error;
  }
};

// 5. Delete Custom Tag
export const deleteCustomTag = async (tagId) => {
  try {
    const response = await apiRequest(`/api/repos/topics/${tagId}`, {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    console.error("deleteCustomTag error:", error);
    throw error;
  }
};