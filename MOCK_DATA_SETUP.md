# Mock Data and API Service Setup

## Overview

This project now has a comprehensive mock data and API service layer that matches the backend API documentation. All services can be easily switched from mock to real API calls.

## Structure

### Mock Data
- **Location**: `src/data/mockData.js`
- Contains all mock data structures matching the API response format
- Includes: users, repositories, channels, messages, members, notifications, activity feed, heatmap data

### API Services
All services are located in `src/services/`:

1. **auth.service** - Authentication endpoints
   - `initiateGitHubLogin()` - Start GitHub OAuth flow
   - `checkAuthStatus()` - Check if user is authenticated
   - `logout()` - Logout user
   - `getCurrentUser()` - Get current user profile

2. **user.service** - User management
   - `getUserProfile()` - Get user profile
   - `updateUserProfile()` - Update profile
   - `getUserStats()` - Get user statistics
   - `getActivityFeed()` - Get activity feed with pagination
   - `getActivityHeatmap()` - Get contribution heatmap
   - `clearActivityLogs()` - Clear activity logs

3. **repo.service** - Repository management
   - `getRepositories()` - List all repositories
   - `getRepository(repoId)` - Get single repository
   - `createRepository(repoData)` - Create new repository
   - `updateRepository(repoId, repoData)` - Update repository
   - `deleteRepository(repoId)` - Delete repository

4. **channel.service** - Channel management
   - `getChannels(repoId)` - List channels
   - `createChannel(repoId, channelData)` - Create channel
   - `updateChannel(repoId, channelId, channelData)` - Rename channel
   - `deleteChannel(repoId, channelId)` - Delete channel
   - `joinChannel(repoId, channelId)` - Join channel
   - `leaveChannel(repoId, channelId)` - Leave channel

5. **message.service** - Messaging
   - `getMessages(repoId, channelId, params)` - Get messages with pagination
   - `sendMessage(repoId, channelId, messageData)` - Send message
   - `deleteMessage(repoId, channelId, messageId)` - Delete message
   - `toggleReaction(repoId, channelId, messageId, reactionData)` - Toggle reaction

6. **member.service** - Member management
   - `getMembers(repoId)` - List members
   - `inviteMember(repoId, memberData)` - Invite member
   - `updateMemberRole(repoId, userId, memberData)` - Update role
   - `removeMember(repoId, userId)` - Remove member

7. **notification.service** - Notifications
   - `getNotifications()` - Get all notifications
   - `updateNotificationPreferences(preferences)` - Update preferences
   - `markNotificationAsRead(notificationId)` - Mark as read
   - `deleteNotification(notificationId)` - Delete notification

## Routing

Routing is now set up using `createBrowserRouter` from `react-router-dom`:

- **Location**: `src/routes.jsx`
- **Updated**: `src/main.jsx` to use `RouterProvider`

### Current Routes:
- `/` - Dashboard
- `/repositories` - Repositories list
- `/repository` - Single repository view
- `/repository/create` - Create repository
- `/workspace` - Workspace view
- `/workspaces` - Workspaces list
- `/profile` - User profile
- `/explore` - Explore page
- `/createWorkspace` - Create workspace

## Usage Example

```javascript
import { getCurrentUser, getRepositories, sendMessage } from '@/services';

// In your component
const MyComponent = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await getCurrentUser();
        const reposRes = await getRepositories();
        
        setUser(userRes.data);
        setRepos(reposRes.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleSendMessage = async () => {
    try {
      const response = await sendMessage('repoId', 'channelId', {
        content: 'Hello!',
        attachments: []
      });
      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    // Your component JSX
  );
};
```

## Switching to Real API

See `API_INTEGRATION_GUIDE.md` for detailed instructions on switching from mock to real API calls.

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_USE_MOCK=true  # Set to false when ready for real API
```

## Notes

- All mock implementations simulate network delays (200-500ms)
- Response structures match the API documentation exactly
- Error handling is included in the base `apiRequest` function
- Session cookies are automatically handled with `credentials: 'include'`
