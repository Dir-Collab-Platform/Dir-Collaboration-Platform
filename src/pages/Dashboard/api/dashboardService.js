// Mocking the responses provided in your requirements
export const dashboardService = {
  // GET /api/activity/feed
  getActivityFeed: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      status: "success",
      data: [
        {
          id: "1",
          user: "zeaman",
          action: "committed to/webapp:",
          targetName: "Dir-Platform",
          targetType: "repository",
          message: "fix: update button styles",
          timestamp: new Date().toISOString(),
          iconType: "commit"
        },
        {
          id: "2",
          user: "zeaman",
          action: "created new branch",
          targetName: "feature-auth",
          targetType: "branch",
          message: "temp",
          timestamp: new Date().toISOString(),
          iconType: "branch"
        }
      ]
    };
  },

  // GET /api/activity/heatmap
  getHeatmapData: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Generate some mock activity for the grid
    return {
      status: "success",
      data: Array.from({ length: 50 }, (_, i) => ({
        _id: `2024-01-${i + 1}`,
        count: Math.floor(Math.random() * 10)
      }))
    };
  },

  // GET Stats & User Info
  getDashboardStats: async () => {
    return {
      status: "success",
      data: {
        activeWorkspacesCount: 10,
        unreadNotifications: 6,
        githubTotalCount: 27,
        totalTasks: 0,
        role: "user",
        githubUsername: "Zeamanuel Meabit",
        avatarUrl: "https://avatars.githubusercontent.com/u/zeaman" 
      }
    };
  }
};