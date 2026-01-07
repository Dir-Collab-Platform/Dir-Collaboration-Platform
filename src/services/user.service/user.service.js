import { mockUser, mockStats, mockActivityFeed, mockHeatmapData } from '../../data/mockData';

// ============================================================================
// USER SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls

/**
 * Get current user profile
 * GET /api/me
 */
export const getUserProfile = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      data: mockUser
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/me');
};

/**
 * Update user profile
 * PATCH /api/profile
 * @param {Object} profileData - Profile fields to update
 */
export const updateUserProfile = async (profileData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    const updatedUser = { ...mockUser, ...profileData };
    return {
      status: 'success',
      data: updatedUser
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/profile', {
  //   method: 'PATCH',
  //   body: JSON.stringify(profileData)
  // });
};

/**
 * Get user statistics
 * GET /api/stats
 */
export const getUserStats = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      data: mockStats
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/stats');
};

/**
 * Get activity feed
 * GET /api/activity/feed
 * @param {Object} params - Query parameters (page, limit, etc.)
 */
export const getActivityFeed = async (params = {}) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFeed = mockActivityFeed.slice(startIndex, endIndex);
    
    return {
      status: 'success',
      data: paginatedFeed,
      pagination: {
        currentPage: page,
        hasNextPage: endIndex < mockActivityFeed.length,
        totalPages: Math.ceil(mockActivityFeed.length / limit)
      }
    };
  }
  
  // Real implementation:
  // const queryString = new URLSearchParams(params).toString();
  // return apiRequest(`/api/activity/feed?${queryString}`);
};

/**
 * Get contribution heatmap data
 * GET /api/activity/heatmap
 */
export const getActivityHeatmap = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      status: 'success',
      data: mockHeatmapData
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/activity/heatmap');
};

/**
 * Clear activity logs
 * DELETE /api/activity/logs
 */
export const clearActivityLogs = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      message: 'Activity logs cleared'
    };
  }
  
  // Real implementation:
  // return apiRequest('/api/activity/logs', { method: 'DELETE' });
};
