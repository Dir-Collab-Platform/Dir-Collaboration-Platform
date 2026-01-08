import { mockMembers } from '../../data/mockData';

// ============================================================================
// MEMBER SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls

/**
 * Get all members of a repository
 * GET /api/repos/:repoId/members
 * @param {string} repoId - Repository ID
 */
export const getMembers = async (repoId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      status: 'success',
      data: mockMembers
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/members`);
};

/**
 * Invite a member to repository
 * POST /api/repos/:repoId/members
 * @param {string} repoId - Repository ID
 * @param {Object} memberData - Member data (githubUsername, role)
 */
export const inviteMember = async (repoId, memberData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newMember = {
      userId: {
        _id: `user_${Date.now()}`,
        githubUsername: memberData.githubUsername,
        avatarUrl: `https://avatars.githubusercontent.com/u/${Date.now()}?v=4`
      },
      role: memberData.role || 'viewer'
    };
    mockMembers.push(newMember);
    return {
      status: 'success',
      message: `User ${memberData.githubUsername} has been invited successfully`,
      data: mockMembers
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/members`, {
  //   method: 'POST',
  //   body: JSON.stringify(memberData)
  // });
};

/**
 * Update member role
 * PATCH /api/repos/:repoId/members/:userId
 * @param {string} repoId - Repository ID
 * @param {string} userId - User ID
 * @param {Object} memberData - Updated member data (role)
 */
export const updateMemberRole = async (repoId, userId, memberData) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const member = mockMembers.find(m => m.userId._id === userId);
    if (!member) {
      throw new Error('Member not found');
    }
    member.role = memberData.role;
    return {
      status: 'success',
      data: mockMembers
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/members/${userId}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(memberData)
  // });
};

/**
 * Remove member from repository
 * DELETE /api/repos/:repoId/members/:userId
 * @param {string} repoId - Repository ID
 * @param {string} userId - User ID
 */
export const removeMember = async (repoId, userId) => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const memberIndex = mockMembers.findIndex(m => m.userId._id === userId);
    if (memberIndex === -1) {
      throw new Error('Member not found');
    }
    mockMembers.splice(memberIndex, 1);
    return {
      status: 'success',
      message: 'Member removed',
      data: mockMembers
    };
  }
  
  // Real implementation:
  // return apiRequest(`/api/repos/${repoId}/members/${userId}`, {
  //   method: 'DELETE'
  // });
};
