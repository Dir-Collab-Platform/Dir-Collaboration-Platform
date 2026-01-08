import { mockUser } from '../../data/mockData';

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================
// When integrating with backend, replace mock implementations with real API calls
// All functions should return the same response structure as documented in API_DOCUMENTATION.md

/**
 * Initiate GitHub OAuth login
 * GET /auth/github
 */
export const initiateGitHubLogin = () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    // In mock mode, just redirect to callback simulation
    console.log('Mock: Redirecting to GitHub OAuth...');
    // In real implementation: window.location.href = `${BASE_URL}/auth/github`;
    return Promise.resolve({ status: 'redirect' });
  }
  
  // Real implementation:
  // window.location.href = `${BASE_URL}/auth/github`;
};

/**
 * Handle GitHub OAuth callback
 * GET /auth/github/callback
 * Note: This is handled server-side, but you might need to check auth status
 */
export const checkAuthStatus = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    // Mock: Return authenticated user
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      status: 'success',
      authenticated: true,
      user: mockUser
    };
  }
  
  // Real implementation:
  // return apiRequest('/auth/github/callback');
};

/**
 * Logout user
 * POST /auth/logout
 */
export const logout = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      status: 'success',
      message: 'Logged out successfully'
    };
  }
  
  // Real implementation:
  // return apiRequest('/auth/logout', { method: 'POST' });
};

/**
 * Get current authenticated user
 * GET /api/me
 */
export const getCurrentUser = async () => {
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
