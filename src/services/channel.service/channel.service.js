import { mockChannels } from '../../data/mockData';

// ============================================================================
// CHANNEL SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls

/**
 * Get all channels for a repository
 * GET /api/repos/:repoId/channels
 * @param {string} repoId - Repository ID
 */
export const getChannels = async (repoId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      data: mockChannels
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels`);
};

/**
 * Create a new channel
 * POST /api/repos/:repoId/channels
 * @param {string} repoId - Repository ID
 * @param {Object} channelData - Channel data (name)
 */
export const createChannel = async (repoId, channelData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newChannel = {
      channel_id: `channel_${Date.now()}`,
      name: channelData.name,
      participants: [],
      _id: `channel_${Date.now()}`
    };
    mockChannels.push(newChannel);
    return {
      status: 'success',
      data: newChannel
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels`, {
  //   method: 'POST',
  //   body: JSON.stringify(channelData)
  // });
};

/**
 * Update channel (rename)
 * PATCH /api/repos/:repoId/channels/:id
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 * @param {Object} channelData - Updated channel data
 */
export const updateChannel = async (repoId, channelId, channelData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const channel = mockChannels.find(c => c._id === channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    channel.name = channelData.name;
    return {
      status: 'success',
      data: channel
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(channelData)
  // });
};

/**
 * Delete channel
 * DELETE /api/repos/:repoId/channels/:id
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 */
export const deleteChannel = async (repoId, channelId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const channelIndex = mockChannels.findIndex(c => c._id === channelId);
    if (channelIndex === -1) {
      throw new Error('Channel not found');
    }
    const channel = mockChannels[channelIndex];
    mockChannels.splice(channelIndex, 1);
    return {
      status: 'success',
      message: `Channel ${channel.name} and messages in ${channel.name} deleted`
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}`, {
  //   method: 'DELETE'
  // });
};

/**
 * Join channel
 * POST /api/repos/:repoId/channels/:id/join
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 */
export const joinChannel = async (repoId, channelId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const channel = mockChannels.find(c => c._id === channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    if (!channel.participants.includes('69563538bd45b3713e795fdc')) {
      channel.participants.push('69563538bd45b3713e795fdc');
    }
    return {
      status: 'success',
      message: `Successfully joined ${channel.name} (and general)`
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}/join`, {
  //   method: 'POST'
  // });
};

/**
 * Leave channel
 * POST /api/repos/:repoId/channels/:id/leave
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 */
export const leaveChannel = async (repoId, channelId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const channel = mockChannels.find(c => c._id === channelId);
    if (channel) {
      channel.participants = channel.participants.filter(
        p => p !== '69563538bd45b3713e795fdc'
      );
    }
    return {
      status: 'success',
      message: 'Left channel successfully'
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}/leave`, {
  //   method: 'POST'
  // });
};
