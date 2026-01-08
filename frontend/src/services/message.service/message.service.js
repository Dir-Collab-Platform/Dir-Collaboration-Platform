import { mockMessages } from '../../data/mockData';

// ============================================================================
// MESSAGE SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls

/**
 * Get messages for a channel
 * GET /api/repos/:repoId/channels/:channelId/messages
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 * @param {Object} params - Query parameters (page, limit)
 */
export const getMessages = async (repoId, channelId, params = {}) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const page = params.page || 1;
    const limit = params.limit || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const channelMessages = mockMessages.filter(m => m.channelId === channelId);
    const paginatedMessages = channelMessages.slice(startIndex, endIndex);
    
    return {
      status: 'success',
      results: paginatedMessages.length,
      data: paginatedMessages
    };
  }
  
  // Real implementation:
  // const queryString = new URLSearchParams(params).toString();
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}/messages?${queryString}`);
};

/**
 * Send a message
 * POST /api/repos/:repoId/channels/:channelId/messages
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 * @param {Object} messageData - Message data (content, attachments)
 */
export const sendMessage = async (repoId, channelId, messageData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newMessage = {
      _id: `MSG_${Date.now()}`,
      content: messageData.content,
      senderId: '69563538bd45b3713e795fdc',
      channelId: channelId,
      attachments: messageData.attachments || [],
      reactions: [],
      createdAt: new Date().toISOString()
    };
    mockMessages.push(newMessage);
    return {
      status: 'success',
      data: newMessage
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}/messages`, {
  //   method: 'POST',
  //   body: JSON.stringify(messageData)
  // });
};

/**
 * Delete a message
 * DELETE /api/repos/:repoId/channels/:channelId/messages/:id
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 * @param {string} messageId - Message ID
 */
export const deleteMessage = async (repoId, channelId, messageId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const messageIndex = mockMessages.findIndex(m => m._id === messageId);
    if (messageIndex === -1) {
      throw new Error('Message not found');
    }
    mockMessages.splice(messageIndex, 1);
    return {
      status: 'success',
      message: 'Message deleted'
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}/messages/${messageId}`, {
  //   method: 'DELETE'
  // });
};

/**
 * Add or toggle reaction on a message
 * PUT /api/repos/:repoId/channels/:channelId/messages/:id/reactions
 * @param {string} repoId - Repository ID
 * @param {string} channelId - Channel ID
 * @param {string} messageId - Message ID
 * @param {Object} reactionData - Reaction data (emoji, repoId)
 */
export const toggleReaction = async (repoId, channelId, messageId, reactionData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const message = mockMessages.find(m => m._id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }
    
    if (!message.reactions) {
      message.reactions = [];
    }
    
    const existingReaction = message.reactions.find(r => r.emoji === reactionData.emoji);
    if (existingReaction) {
      // Toggle: remove if user already reacted, add if not
      const userIndex = existingReaction.users.indexOf('69563538bd45b3713e795fdc');
      if (userIndex > -1) {
        existingReaction.users.splice(userIndex, 1);
        if (existingReaction.users.length === 0) {
          message.reactions = message.reactions.filter(r => r.emoji !== reactionData.emoji);
        }
      } else {
        existingReaction.users.push('69563538bd45b3713e795fdc');
      }
    } else {
      message.reactions.push({
        emoji: reactionData.emoji,
        users: ['69563538bd45b3713e795fdc']
      });
    }
    
    return {
      status: 'success',
      data: message
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/channels/${channelId}/messages/${messageId}/reactions`, {
  //   method: 'PUT',
  //   body: JSON.stringify(reactionData)
  // });
};
