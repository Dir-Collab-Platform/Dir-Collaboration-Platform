import { mockRepositories } from '../../data/mockData';

// ============================================================================
// REPOSITORY SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls

/**
 * Get all repositories for current user
 * GET /api/repos
 */
export const getRepositories = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      status: 'success',
      data: mockRepositories
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/repos');
};

/**
 * Get single repository by ID
 * GET /api/repos/:repoId
 * @param {string} repoId - Repository ID
 */
export const getRepository = async (repoId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const repo = mockRepositories.find(r => r._id === repoId);
    if (!repo) {
      throw new Error('Repository not found');
    }
    return {
      status: 'success',
      data: repo
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}`);
};

/**
 * Create new repository
 * POST /api/repos
 * @param {Object} repoData - Repository data
 */
export const createRepository = async (repoData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRepo = {
      _id: `repo_${Date.now()}`,
      ...repoData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      members: [],
      channels: [],
      tags: [],
      tasks: [],
      files: [],
      webhookEvents: []
    };
    mockRepositories.push(newRepo);
    return {
      status: 'success',
      data: newRepo
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/repos', {
  //   method: 'POST',
  //   body: JSON.stringify(repoData)
  // });
};

/**
 * Update repository
 * PATCH /api/repos/:repoId
 * @param {string} repoId - Repository ID
 * @param {Object} repoData - Updated repository data
 */
export const updateRepository = async (repoId, repoData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    const repoIndex = mockRepositories.findIndex(r => r._id === repoId);
    if (repoIndex === -1) {
      throw new Error('Repository not found');
    }
    mockRepositories[repoIndex] = {
      ...mockRepositories[repoIndex],
      ...repoData,
      updatedAt: new Date().toISOString()
    };
    return {
      status: 'success',
      data: mockRepositories[repoIndex]
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(repoData)
  // });
};

/**
 * Delete repository
 * DELETE /api/repos/:repoId
 * @param {string} repoId - Repository ID
 */
export const deleteRepository = async (repoId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const repoIndex = mockRepositories.findIndex(r => r._id === repoId);
    if (repoIndex === -1) {
      throw new Error('Repository not found');
    }
    mockRepositories.splice(repoIndex, 1);
    return {
      status: 'success',
      message: 'Repository deleted'
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}`, { method: 'DELETE' });
};
