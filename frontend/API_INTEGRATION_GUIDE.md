# API Integration Guide

This guide explains how to switch from mock data to real API calls when integrating with the backend.

## Overview

The project uses a service layer architecture where all API calls are abstracted into service functions. Currently, all services use mock data, but they can be easily switched to real API calls.

## Service Structure

All API services are located in `src/services/`:
- `auth.service/` - Authentication endpoints
- `user.service/` - User profile and activity endpoints
- `repo.service/` - Repository CRUD operations
- `channel.service/` - Channel management
- `message.service/` - Messaging functionality
- `member.service/` - Member management
- `notification.service/` - Notifications

## Switching from Mock to Real API

### Step 1: Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK=false
```

### Step 2: Update Service Functions

Each service file has mock implementations that check `import.meta.env.VITE_USE_MOCK`. When this is set to `false`, the real API implementation (commented out) should be uncommented.

Example from `auth.service.js`:

```javascript
export const getCurrentUser = async () => {
  if (import.meta.env.VITE_USE_MOCK !== 'false') {
    // Mock implementation
    return { status: 'success', data: mockUser };
  }
  
  // Real implementation - uncomment this:
  return apiRequest('/api/me');
};
```

### Step 3: Update Base API Configuration

The base API configuration is in `src/services/api/api.js`. Update the `apiRequest` function to use your preferred HTTP client (axios, fetch, etc.).

## API Endpoints Reference

Based on the API documentation, here are the main endpoints:

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - OAuth callback (handled server-side)
- `POST /auth/logout` - Logout user

### User
- `GET /api/me` - Get current user
- `PATCH /api/profile` - Update user profile
- `GET /api/stats` - Get user statistics
- `GET /api/activity/feed` - Get activity feed
- `GET /api/activity/heatmap` - Get contribution heatmap
- `DELETE /api/activity/logs` - Clear activity logs

### Repositories
- `GET /api/repos` - List repositories
- `GET /api/repos/:repoId` - Get repository
- `POST /api/repos` - Create repository
- `PATCH /api/repos/:repoId` - Update repository
- `DELETE /api/repos/:repoId` - Delete repository

### Channels
- `GET /api/repos/:repoId/channels` - List channels
- `POST /api/repos/:repoId/channels` - Create channel
- `PATCH /api/repos/:repoId/channels/:id` - Update channel
- `DELETE /api/repos/:repoId/channels/:id` - Delete channel
- `POST /api/repos/:repoId/channels/:id/join` - Join channel
- `POST /api/repos/:repoId/channels/:id/leave` - Leave channel

### Messages
- `GET /api/repos/:repoId/channels/:channelId/messages` - Get messages
- `POST /api/repos/:repoId/channels/:channelId/messages` - Send message
- `DELETE /api/repos/:repoId/channels/:channelId/messages/:id` - Delete message
- `PUT /api/repos/:repoId/channels/:channelId/messages/:id/reactions` - Toggle reaction

### Members
- `GET /api/repos/:repoId/members` - List members
- `POST /api/repos/:repoId/members` - Invite member
- `PATCH /api/repos/:repoId/members/:userId` - Update member role
- `DELETE /api/repos/:repoId/members/:userId` - Remove member

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/preferences` - Update preferences
- `PATCH /api/notifications/:id/read` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

## Important Notes

1. **Session Cookies**: The API uses session cookies (`dir.sid`). Make sure `credentials: 'include'` is set in fetch requests (already configured in `apiRequest`).

2. **Error Handling**: All service functions should handle errors appropriately. The current mock implementations don't throw errors, but real implementations should.

3. **Response Format**: All API responses follow this format:
   ```json
   {
     "status": "success",
     "data": { ... }
   }
   ```

4. **Pagination**: Some endpoints support pagination. Check the API documentation for query parameters.

## Testing

1. Start with mock data (`VITE_USE_MOCK=true`) to develop UI
2. Switch to real API (`VITE_USE_MOCK=false`) when ready to integrate
3. Test each endpoint individually before full integration

## Example Usage

```javascript
import { getCurrentUser, getRepositories } from '@/services';

// In your component
const fetchData = async () => {
  try {
    const userResponse = await getCurrentUser();
    const reposResponse = await getRepositories();
    
    setUser(userResponse.data);
    setRepos(reposResponse.data);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
};
```
