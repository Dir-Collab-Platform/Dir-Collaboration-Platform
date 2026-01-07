// Comprehensive mock data based on API documentation
// This file contains all mock data that matches the API response structure

export const mockUser = {
  _id: "69563538bd45b3713e795fdc",
  githubUsername: "Abe-Alefew",
  githubId: "75578348",
  email: "abrhamalem48829@gmail.com",
  avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4",
  profileUrl: "https://github.com/Abe-Alefew",
  role: "user",
  isActive: true,
  lastLogin: new Date().toISOString(),
  preferences: {
    notificationsEnabled: true,
    emailNotifications: false,
    theme: "dark"
  },
  githubRepoCount: 27,
  reposOwned: []
};

export const mockRepositories = [
  {
    _id: "695ab849e8baa0a99c896eea",
    githubId: "1002903005",
    githubRepoName: "MiniGitProject",
    githubOwner: "Abe-Alefew",
    workspaceName: "Mini-Git Workspace",
    githubFullName: "Abe-Alefew/MiniGitProject",
    description: "A lightweight Git like version control system in C++",
    ownerId: "69563538bd45b3713e795fdc",
    url: "https://github.com/Abe-Alefew/MiniGitProject",
    isPrivate: false,
    language: "C++",
    members: [
      {
        userId: "69563538bd45b3713e795fdc",
        role: "owner",
        _id: "695ab849e8baa0a99c896eeb",
        joinedAt: "2026-01-04T18:58:17.446Z"
      }
    ],
    channels: [
      {
        channel_id: "695ab849e8baa0a99c896ee9",
        name: "general",
        _id: "695ab849e8baa0a99c896eec",
        created_at: "2026-01-04T18:58:17.448Z",
        participants: ["69563538bd45b3713e795fdc"]
      },
      {
        channel_id: "695bd3d3143f1801cfdb2b6e",
        name: "backend-team",
        participants: [],
        _id: "695bd3d3143f1801cfdb2b6f",
        created_at: "2026-01-05T15:08:03.049Z"
      }
    ],
    tags: ["DSA"],
    tasks: [],
    files: [],
    webhookEvents: [],
    createdAt: "2026-01-04T18:58:17.465Z",
    updatedAt: "2026-01-05T21:44:36.329Z",
    __v: 0
  },
  {
    _id: "695ac74c1d13c757f510efc9",
    githubId: "1075251834",
    githubRepoName: "Task-Master",
    githubOwner: "Abe-Alefew",
    workspaceName: "Task-Master",
    githubFullName: "Abe-Alefew/Task-Master",
    description: "this was a simple flask learning project",
    ownerId: "69563538bd45b3713e795fdc",
    url: "https://github.com/Abe-Alefew/Task-Master",
    isPrivate: false,
    language: "CSS",
    members: [
      {
        userId: "69563538bd45b3713e795fdc",
        role: "owner",
        _id: "695ac74c1d13c757f510efca",
        joinedAt: "2026-01-04T20:02:20.264Z"
      }
    ],
    channels: [
      {
        channel_id: "695ac74c1d13c757f510efc8",
        name: "general",
        _id: "695ac74c1d13c757f510efcb",
        created_at: "2026-01-04T20:02:20.270Z"
      }
    ],
    tags: [],
    tasks: [],
    files: [],
    webhookEvents: [],
    createdAt: "2026-01-04T20:02:20.294Z",
    updatedAt: "2026-01-04T20:02:20.294Z",
    __v: 0
  }
];

export const mockChannels = [
  {
    channel_id: "695ab849e8baa0a99c896ee9",
    name: "general",
    participants: ["69563538bd45b3713e795fdc"],
    _id: "695ab849e8baa0a99c896ee9"
  },
  {
    channel_id: "695bd3d3143f1801cfdb2b6e",
    name: "backend-team",
    participants: [],
    _id: "695bd3d3143f1801cfdb2b6e"
  }
];

export const mockMessages = [
  {
    _id: "MSG_001",
    content: "Hello world",
    senderId: {
      _id: "69563538bd45b3713e795fdc",
      githubUsername: "Abe-Alefew",
      avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4"
    },
    channelId: "695ab849e8baa0a99c896ee9",
    reactions: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: "MSG_002",
    content: "Hello @Abe-Alefew!",
    senderId: {
      _id: "69563538bd45b3713e795fdc",
      githubUsername: "Abe-Alefew",
      avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4"
    },
    channelId: "695ab849e8baa0a99c896ee9",
    reactions: [{ emoji: "👍", users: ["69563538bd45b3713e795fdc"] }],
    attachments: [],
    createdAt: new Date().toISOString()
  }
];

export const mockMembers = [
  {
    userId: {
      _id: "69563538bd45b3713e795fdc",
      githubUsername: "Abe-Alefew",
      avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4"
    },
    role: "owner"
  }
];

export const mockNotifications = [
  {
    _id: "NOTIF_001",
    message: "You were added to specific-channel",
    isRead: false,
    type: "message",
    createdAt: new Date().toISOString()
  },
  {
    _id: "NOTIF_002",
    message: "New commit in MiniGitProject",
    isRead: false,
    type: "commit",
    createdAt: new Date().toISOString()
  }
];

export const mockActivityFeed = [
  {
    id: "65e123",
    user: "Abe-Alefew",
    action: "imported repository",
    targetName: "MiniGitProject",
    targetType: "repository",
    message: "Initialized workspace for MiniGitProject",
    timestamp: new Date().toISOString(),
    iconType: "repository"
  },
  {
    id: "65e124",
    user: "Abe-Alefew",
    action: "committed to",
    targetName: "Task-Master",
    targetType: "repository",
    message: "fix: update button styles",
    timestamp: new Date().toISOString(),
    iconType: "commit"
  }
];

export const mockHeatmapData = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  return {
    _id: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 10)
  };
});

export const mockStats = {
  activeWorkspacesCount: 10,
  unreadNotifications: 6,
  githubTotalCount: 27,
  totalTasks: 0,
  role: "user",
  githubUsername: "Abe-Alefew",
  avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4"
};
