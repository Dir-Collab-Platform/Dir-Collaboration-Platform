// Comprehensive mock data based on API documentation
// This file contains all mock data that matches the API response structure

// Helper function to generate messages
const generateMessages = (channelId, count, startDate = new Date()) => {
    const messages = [];
    const sampleMessages = [
        "Hello everyone! Welcome to the channel.",
        "Has anyone started working on the new feature?",
        "I've pushed the latest changes. Please review.",
        "The meeting is scheduled for tomorrow at 2 PM.",
        "Can someone help me with the authentication flow?",
        "Great work on the last PR! 🎉",
        "I found a bug in the login component. Investigating now.",
        "The deployment was successful!",
        "Let's discuss the architecture changes in the next standup.",
        "I've updated the documentation. Check it out!",
        "The CI/CD pipeline is failing. Need help debugging.",
        "New design mockups are ready for review.",
        "Thanks for the feedback! I'll implement the changes.",
        "The API endpoint is now live.",
        "We need to update the dependencies."
    ];

    for (let i = 0; i < count; i++) {
        const date = new Date(startDate);
        date.setHours(date.getHours() - (count - i));
        messages.push({
            _id: `MSG_${channelId}_${i}`,
            content: sampleMessages[i % sampleMessages.length],
            senderId: `user_${Math.floor(Math.random() * 5) + 1}`,
            channelId: channelId,
            reactions: Math.random() > 0.7 ? [{ emoji: "👍", users: [`user_${Math.floor(Math.random() * 5) + 1}`] }] : [],
            attachments: [],
            createdAt: date.toISOString()
        });
    }
    return messages;
};

// Mock users for members
export const mockUsers = [
    {
        _id: "user_1",
        githubUsername: "Abe-Alefew",
        githubId: "75578348",
        email: "abe@example.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4",
        profileUrl: "https://github.com/Abe-Alefew"
    },
    {
        _id: "user_2",
        githubUsername: "zeaman",
        githubId: "12345678",
        email: "zeaman@example.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/12345678?v=4",
        profileUrl: "https://github.com/zeaman"
    },
    {
        _id: "user_3",
        githubUsername: "efrata",
        githubId: "87654321",
        email: "efrata@example.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/87654321?v=4",
        profileUrl: "https://github.com/efrata"
    },
    {
        _id: "user_4",
        githubUsername: "boanergaes",
        githubId: "11223344",
        email: "boanergaes@example.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/11223344?v=4",
        profileUrl: "https://github.com/boanergaes"
    },
    {
        _id: "user_5",
        githubUsername: "alemu",
        githubId: "55667788",
        email: "alemu@example.com",
        avatarUrl: "https://avatars.githubusercontent.com/u/55667788?v=4",
        profileUrl: "https://github.com/alemu"
    }
];

export const mockUser = mockUsers[0]; // Current logged in user

// 4 Workspaces (repos that have been imported as workspaces)
export const mockWorkspaces = [
    {
        _id: "workspace_1",
        githubId: "1002903005",
        githubRepoName: "MiniGitProject",
        githubOwner: "Abe-Alefew",
        workspaceName: "Mini-Git Workspace",
        githubFullName: "Abe-Alefew/MiniGitProject",
        description: "A lightweight Git like version control system in C++",
        ownerId: "user_1",
        url: "https://github.com/Abe-Alefew/MiniGitProject",
        isPrivate: false,
        language: "C++",
        isImported: true,
        stars: 124,
        members: [
            { userId: "user_1", role: "owner", _id: "mem_1_1", joinedAt: "2026-01-04T18:58:17.446Z" },
            { userId: "user_2", role: "admin", _id: "mem_1_2", joinedAt: "2026-01-05T10:00:00.000Z" },
            { userId: "user_3", role: "contributor", _id: "mem_1_3", joinedAt: "2026-01-06T14:30:00.000Z" }
        ],
        channels: [
            { channel_id: "ch_1_1", name: "general", _id: "ch_1_1", created_at: "2026-01-04T18:58:17.448Z", participants: ["user_1", "user_2", "user_3"] },
            { channel_id: "ch_1_2", name: "backend-team", _id: "ch_1_2", created_at: "2026-01-05T15:08:03.049Z", participants: ["user_1", "user_2"] },
            { channel_id: "ch_1_3", name: "frontend-team", _id: "ch_1_3", created_at: "2026-01-06T09:00:00.000Z", participants: ["user_3"] },
            { channel_id: "ch_1_4", name: "design", _id: "ch_1_4", created_at: "2026-01-07T11:00:00.000Z", participants: [] } // Empty channel
        ],
        tags: ["DSA", "C++", "Version-Control"],
        tasks: [],
        files: [],
        webhookEvents: [],
        createdAt: "2026-01-04T18:58:17.465Z",
        updatedAt: "2026-01-05T21:44:36.329Z"
    },
    {
        _id: "workspace_2",
        githubId: "1075251834",
        githubRepoName: "Task-Master",
        githubOwner: "Abe-Alefew",
        workspaceName: "Task-Master",
        githubFullName: "Abe-Alefew/Task-Master",
        description: "A simple flask learning project for task management",
        ownerId: "user_1",
        url: "https://github.com/Abe-Alefew/Task-Master",
        isPrivate: false,
        language: "Python",
        isImported: true,
        stars: 45,
        members: [
            { userId: "user_1", role: "owner", _id: "mem_2_1", joinedAt: "2026-01-04T20:02:20.264Z" },
            { userId: "user_4", role: "admin", _id: "mem_2_2", joinedAt: "2026-01-05T08:00:00.000Z" },
            { userId: "user_5", role: "contributor", _id: "mem_2_3", joinedAt: "2026-01-06T12:00:00.000Z" },
            { userId: "user_2", role: "viewer", _id: "mem_2_4", joinedAt: "2026-01-07T09:00:00.000Z" }
        ],
        channels: [
            { channel_id: "ch_2_1", name: "general", _id: "ch_2_1", created_at: "2026-01-04T20:02:20.270Z", participants: ["user_1", "user_4", "user_5", "user_2"] },
            { channel_id: "ch_2_2", name: "backend", _id: "ch_2_2", created_at: "2026-01-05T10:00:00.000Z", participants: ["user_1", "user_4"] },
            { channel_id: "ch_2_3", name: "discussions", _id: "ch_2_3", created_at: "2026-01-06T14:00:00.000Z", participants: [] } // Empty channel
        ],
        tags: ["Flask", "Python", "Web"],
        tasks: [],
        files: [],
        webhookEvents: [],
        createdAt: "2026-01-04T20:02:20.294Z",
        updatedAt: "2026-01-04T20:02:20.294Z"
    },
    {
        _id: "workspace_3",
        githubId: "1113146495",
        githubRepoName: "Dir-Platform",
        githubOwner: "boanergaes",
        workspaceName: "Dir Platform Workspace",
        githubFullName: "boanergaes/Dir-Platform",
        description: "The main platform repository for Dir collaboration tool",
        ownerId: "user_4",
        url: "https://github.com/boanergaes/Dir-Platform",
        isPrivate: false,
        language: "JavaScript",
        isImported: true,
        stars: 892,
        members: [
            { userId: "user_4", role: "owner", _id: "mem_3_1", joinedAt: "2026-01-01T10:00:00.000Z" },
            { userId: "user_1", role: "admin", _id: "mem_3_2", joinedAt: "2026-01-02T11:00:00.000Z" },
            { userId: "user_2", role: "contributor", _id: "mem_3_3", joinedAt: "2026-01-03T12:00:00.000Z" },
            { userId: "user_3", role: "contributor", _id: "mem_3_4", joinedAt: "2026-01-04T13:00:00.000Z" },
            { userId: "user_5", role: "viewer", _id: "mem_3_5", joinedAt: "2026-01-05T14:00:00.000Z" }
        ],
        channels: [
            { channel_id: "ch_3_1", name: "general", _id: "ch_3_1", created_at: "2026-01-01T10:00:00.000Z", participants: ["user_4", "user_1", "user_2", "user_3", "user_5"] },
            { channel_id: "ch_3_2", name: "core-team", _id: "ch_3_2", created_at: "2026-01-02T11:00:00.000Z", participants: ["user_4", "user_1"] },
            { channel_id: "ch_3_3", name: "frontend", _id: "ch_3_3", created_at: "2026-01-03T12:00:00.000Z", participants: ["user_2", "user_3"] },
            { channel_id: "ch_3_4", name: "backend", _id: "ch_3_4", created_at: "2026-01-04T13:00:00.000Z", participants: ["user_1", "user_4"] },
            { channel_id: "ch_3_5", name: "design", _id: "ch_3_5", created_at: "2026-01-05T14:00:00.000Z", participants: ["user_3"] }
        ],
        tags: ["JavaScript", "React", "Collaboration"],
        tasks: [],
        files: [],
        webhookEvents: [],
        createdAt: "2026-01-01T10:00:00.000Z",
        updatedAt: "2026-01-08T15:00:00.000Z"
    },
    {
        _id: "workspace_4",
        githubId: "1224567890",
        githubRepoName: "E-Commerce-App",
        githubOwner: "zeaman",
        workspaceName: "E-Commerce Workspace",
        githubFullName: "zeaman/E-Commerce-App",
        description: "A full-stack e-commerce application with React and Node.js",
        ownerId: "user_2",
        url: "https://github.com/zeaman/E-Commerce-App",
        isPrivate: false,
        language: "TypeScript",
        isImported: true,
        stars: 210,
        members: [
            { userId: "user_2", role: "owner", _id: "mem_4_1", joinedAt: "2025-12-20T09:00:00.000Z" },
            { userId: "user_1", role: "admin", _id: "mem_4_2", joinedAt: "2025-12-21T10:00:00.000Z" },
            { userId: "user_3", role: "contributor", _id: "mem_4_3", joinedAt: "2025-12-22T11:00:00.000Z" }
        ],
        channels: [
            { channel_id: "ch_4_1", name: "general", _id: "ch_4_1", created_at: "2025-12-20T09:00:00.000Z", participants: ["user_2", "user_1", "user_3"] },
            { channel_id: "ch_4_2", name: "features", _id: "ch_4_2", created_at: "2025-12-21T10:00:00.000Z", participants: ["user_1", "user_3"] },
            { channel_id: "ch_4_3", name: "bugs", _id: "ch_4_3", created_at: "2025-12-22T11:00:00.000Z", participants: [] } // Empty channel
        ],
        tags: ["TypeScript", "React", "Node.js", "E-Commerce"],
        tasks: [],
        files: [],
        webhookEvents: [],
        createdAt: "2025-12-20T09:00:00.000Z",
        updatedAt: "2026-01-07T16:00:00.000Z"
    }
];

// 3 Repositories (NOT workspaces - just repos)
export const mockRepositories = [
    {
        _id: "repo_1",
        githubId: "2001234567",
        githubRepoName: "Shop-easy",
        githubOwner: "zeaman",
        githubFullName: "zeaman/Shop-easy",
        description: "A simple e-commerce frontend with cart, filters, and checkout UI",
        ownerId: "user_2",
        url: "https://github.com/zeaman/Shop-easy",
        isPrivate: false,
        language: "JavaScript",
        isImported: false,
        stars: 56,
        members: [
            { userId: "user_2", role: "owner", _id: "mem_r1_1", joinedAt: "2025-11-15T08:00:00.000Z" },
            { userId: "user_1", role: "contributor", _id: "mem_r1_2", joinedAt: "2025-11-16T09:00:00.000Z" }
        ],
        tags: ["JavaScript", "E-Commerce", "Frontend"],
        createdAt: "2025-11-15T08:00:00.000Z",
        updatedAt: "2026-01-06T10:00:00.000Z"
    },
    {
        _id: "repo_2",
        githubId: "2002345678",
        githubRepoName: "MedNote",
        githubOwner: "efrata",
        githubFullName: "efrata/MedNote",
        description: "Stores digital prescriptions and appointment reminders",
        ownerId: "user_3",
        url: "https://github.com/efrata/MedNote",
        isPrivate: false,
        language: "Python",
        isImported: false,
        stars: 32,
        members: [
            { userId: "user_3", role: "owner", _id: "mem_r2_1", joinedAt: "2025-10-10T07:00:00.000Z" },
            { userId: "user_4", role: "admin", _id: "mem_r2_2", joinedAt: "2025-10-11T08:00:00.000Z" },
            { userId: "user_5", role: "contributor", _id: "mem_r2_3", joinedAt: "2025-10-12T09:00:00.000Z" },
            { userId: "user_1", role: "viewer", _id: "mem_r2_4", joinedAt: "2025-10-13T10:00:00.000Z" }
        ],
        tags: ["Python", "Healthcare", "Django"],
        createdAt: "2025-10-10T07:00:00.000Z",
        updatedAt: "2026-01-05T11:00:00.000Z"
    },
    {
        _id: "repo_3",
        githubId: "2003456789",
        githubRepoName: "SehaMate",
        githubOwner: "alemu",
        githubFullName: "alemu/SehaMate",
        description: "Inclusive digital health assistant with translation, voice support, and accessibility features",
        ownerId: "user_5",
        url: "https://github.com/alemu/SehaMate",
        isPrivate: true,
        language: "TypeScript",
        isImported: false,
        stars: 12,
        members: [
            { userId: "user_5", role: "owner", _id: "mem_r3_1", joinedAt: "2025-09-05T06:00:00.000Z" },
            { userId: "user_2", role: "admin", _id: "mem_r3_2", joinedAt: "2025-09-06T07:00:00.000Z" },
            { userId: "user_3", role: "contributor", _id: "mem_r3_3", joinedAt: "2025-09-07T08:00:00.000Z" }
        ],
        tags: ["TypeScript", "Healthcare", "Accessibility", "AI"],
        createdAt: "2025-09-05T06:00:00.000Z",
        updatedAt: "2026-01-04T12:00:00.000Z"
    }
];

// All repos and workspaces combined
export const mockAllRepos = [...mockWorkspaces, ...mockRepositories];

// Generate all messages for all channels
export const mockMessages = [
    // Workspace 1 messages
    ...generateMessages("ch_1_1", 12), // general channel
    ...generateMessages("ch_1_2", 15), // backend-team channel
    ...generateMessages("ch_1_3", 10), // frontend-team channel
    // ch_1_4 (design) has no messages - empty channel

    // Workspace 2 messages
    ...generateMessages("ch_2_1", 11), // general channel
    ...generateMessages("ch_2_2", 13), // backend channel
    // ch_2_3 (discussions) has no messages - empty channel

    // Workspace 3 messages
    ...generateMessages("ch_3_1", 14), // general channel
    ...generateMessages("ch_3_2", 12), // core-team channel
    ...generateMessages("ch_3_3", 10), // frontend channel
    ...generateMessages("ch_3_4", 11), // backend channel
    ...generateMessages("ch_3_5", 10), // design channel

    // Workspace 4 messages
    ...generateMessages("ch_4_1", 13), // general channel
    ...generateMessages("ch_4_2", 10), // features channel
    // ch_4_3 (bugs) has no messages - empty channel
];

// All channels across all workspaces
export const mockChannels = mockWorkspaces.flatMap(ws => ws.channels);

// All members across all repos/workspaces
export const mockAllMembers = mockAllRepos.flatMap(repo =>
    repo.members.map(mem => ({
        ...mem,
        repoId: repo._id,
        userId: mockUsers.find(u => u._id === mem.userId) || { _id: mem.userId, githubUsername: "Unknown" }
    }))
);

export const mockNotifications = [
    {
        id: 1,
        type: 'message',
        label: 'Message',
        time: '2hrs ago',
        channel: '#Front-end team',
        userImg: '/assets/images/person.jpg',
        userName: 'Efrata',
        shortMessage: 'Efrata: Have you finished designing...',
        fullMessage: 'Efrata: Have you finished designing the header component for the repository page? We need it by tomorrow for the upcoming sprint review. Could you also add the dark mode toggle functionality?',
        hasMore: true,
        read: false
    },
    {
        id: 2,
        type: 'github',
        label: 'GitHub',
        time: '2hrs ago',
        repo: 'My-repository',
        user: 'Abrsh123',
        shortPR: 'I implemented the file browsing features...',
        fullPR: 'I implemented the file browsing features with drag-and-drop support and improved the UI for better user experience. Added file type icons, keyboard shortcuts, and bulk selection capabilities. Also optimized the performance for handling large repositories.',
        hasMore: true,
        read: false
    },
    {
        id: 3,
        type: 'alert',
        label: 'Alert',
        time: '2hrs ago',
        repo: 'My-repository',
        shortAlert: 'Someone logged in with your GitHub account on device...',
        fullAlert: 'Someone logged in with your GitHub account from a new device in London, UK. If this wasn\'t you, please secure your account immediately. Check your account activity and consider changing your password and enabling two-factor authentication.',
        hasMore: true,
        read: false
    }
];

export const mockPastNotifications = [
    {
        id: 101,
        type: 'message',
        label: 'Message',
        time: 'Yesterday',
        channel: '#Design-team',
        userImg: '/assets/images/person.jpg',
        userName: 'Sarah',
        shortMessage: 'Sarah: Can you review the new UI mockups...',
        fullMessage: 'Sarah: Can you review the new UI mockups for the dashboard? I\'ve uploaded them to Figma. Let me know if you have any feedback on the color scheme and layout.',
        hasMore: true,
        past: true
    },
    {
        id: 102,
        type: 'github',
        label: 'GitHub',
        time: '1 day ago',
        repo: 'Design-system',
        user: 'DesignLead',
        shortPR: 'Added new color variables and typography...',
        fullPR: 'Added new color variables and typography scale to the design system. This includes new tokens for spacing, shadows, and component-specific styling improvements.',
        hasMore: true,
        past: true
    }
];

export const mockActivityFeed = [
    {
        id: "act_1",
        user: "Abe-Alefew",
        action: "imported repository",
        targetName: "MiniGitProject",
        targetType: "repository",
        message: "Initialized workspace for MiniGitProject",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        iconType: "repository"
    },
    {
        id: "act_2",
        user: "Abe-Alefew",
        action: "committed to",
        targetName: "Task-Master",
        targetType: "repository",
        message: "fix: update button styles",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        iconType: "commit"
    },
    {
        id: "act_3",
        user: "zeaman",
        action: "created new branch",
        targetName: "feature-auth",
        targetType: "branch",
        message: "Added authentication flow",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        iconType: "branch"
    },
    {
        id: "act_4",
        user: "boanergaes",
        action: "merged pull request",
        targetName: "Dir-Platform",
        targetType: "repository",
        message: "PR #42: Implemented file browsing",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        iconType: "merge"
    },
    {
        id: "act_5",
        user: "efrata",
        action: "opened issue",
        targetName: "MedNote",
        targetType: "repository",
        message: "Issue #15: Add prescription export feature",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        iconType: "issue"
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
    activeWorkspacesCount: mockWorkspaces.length,
    unreadNotifications: mockNotifications.filter(n => !n.isRead).length,
    githubTotalCount: 27,
    totalTasks: 0,
    role: "user",
    githubUsername: "Abe-Alefew",
    avatarUrl: "https://avatars.githubusercontent.com/u/75578348?v=4"
};

// Topics/Tags mock data (GET /api/repos/topics)
export const mockTopics = [
    { name: "javascript", label: "JavaScript", color: "#f1e05a" },
    { name: "web-development", label: "Web Development", color: "#4b5563" },
    { name: "python", label: "Python", color: "#3572A5" },
    { name: "react", label: "React", color: "#61dafb" },
    { name: "nodejs", label: "Node.js", color: "#339933" },
    { name: "typescript", label: "TypeScript", color: "#3178c6" },
    { name: "cpp", label: "C++", color: "#f34b7d" },
    { name: "rust", label: "Rust", color: "#dea584" },
    { name: "healthcare", label: "Healthcare", color: "#10b981" },
    { name: "e-commerce", label: "E-Commerce", color: "#8b5cf6" },
    { name: "dsa", label: "DSA", color: "#f59e0b" },
    { name: "version-control", label: "Version Control", color: "#6366f1" },
    { name: "flask", label: "Flask", color: "#000000" },
    { name: "collaboration", label: "Collaboration", color: "#ec4899" },
    { name: "accessibility", label: "Accessibility", color: "#14b8a6" },
    { name: "ai", label: "AI", color: "#a855f7" }
];

// Languages mock data (GET /api/repos/languages/:id)
// Structure: { label, value (percentage), color }
export const mockLanguages = {
    "workspace_1": [
        { label: "C++", value: 85.5, color: "#f34b7d" },
        { label: "CMake", value: 10.2, color: "#064f8c" },
        { label: "Shell", value: 4.3, color: "#89e051" }
    ],
    "workspace_2": [
        { label: "Python", value: 70.0, color: "#3572A5" },
        { label: "HTML", value: 20.5, color: "#e34c26" },
        { label: "CSS", value: 9.5, color: "#563d7c" }
    ],
    "workspace_3": [
        { label: "JavaScript", value: 65.5, color: "#f1e05a" },
        { label: "TypeScript", value: 25.3, color: "#3178c6" },
        { label: "CSS", value: 9.2, color: "#563d7c" }
    ],
    "workspace_4": [
        { label: "TypeScript", value: 60.0, color: "#3178c6" },
        { label: "JavaScript", value: 30.0, color: "#f1e05a" },
        { label: "CSS", value: 10.0, color: "#563d7c" }
    ],
    "repo_1": [
        { label: "JavaScript", value: 50.3, color: "#f1e05a" },
        { label: "HTML", value: 33.4, color: "#e34c26" },
        { label: "CSS", value: 16.3, color: "#563d7c" }
    ],
    "repo_2": [
        { label: "Python", value: 75.0, color: "#3572A5" },
        { label: "HTML", value: 15.0, color: "#e34c26" },
        { label: "CSS", value: 10.0, color: "#563d7c" }
    ],
    "repo_3": [
        { label: "TypeScript", value: 80.0, color: "#3178c6" },
        { label: "JavaScript", value: 20.0, color: "#f1e05a" }
    ]
};

// Repository contents mock data (file content as plain text, not encoded)
export const mockRepositoryContents = {
    "workspace_1": [
        {
            name: "README.md",
            path: "README.md",
            type: "file",
            size: 1500,
            sha: "1a2b3c4d",
            content: `# MiniGitProject

A lightweight Git-like version control system implemented in C++.

## Features

- Version control operations
- Branch management
- Commit history tracking
- Repository initialization

## Installation

\`\`\`bash
mkdir build && cd build
cmake ..
make
\`\`\`

## Usage

\`\`\`bash
./minigit init
./minigit add <file>
./minigit commit -m "message"
\`\`\`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
`
        },
        {
            name: "main.cpp",
            path: "src/main.cpp",
            type: "file",
            size: 3200,
            sha: "2c9e41b0",
            content: `#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <filesystem>

namespace fs = std::filesystem;

class MiniGit {
private:
    std::string repoPath;
    
public:
    MiniGit(const std::string& path) : repoPath(path) {}
    
    void init() {
        fs::create_directory(repoPath + "/.minigit");
        std::cout << "Initialized MiniGit repository" << std::endl;
    }
    
    void add(const std::string& file) {
        // Add file to staging area
        std::cout << "Added " << file << " to staging" << std::endl;
    }
    
    void commit(const std::string& message) {
        // Create commit
        std::cout << "Committed: " << message << std::endl;
    }
};

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage: minigit <command>" << std::endl;
        return 1;
    }
    
    MiniGit git(".");
    std::string command = argv[1];
    
    if (command == "init") {
        git.init();
    } else if (command == "add") {
        if (argc < 3) {
            std::cerr << "Usage: minigit add <file>" << std::endl;
            return 1;
        }
        git.add(argv[2]);
    } else if (command == "commit") {
        if (argc < 4 || std::string(argv[2]) != "-m") {
            std::cerr << "Usage: minigit commit -m <message>" << std::endl;
            return 1;
        }
        git.commit(argv[3]);
    }
    
    return 0;
}
`
        },
        {
            name: "CMakeLists.txt",
            path: "CMakeLists.txt",
            type: "file",
            size: 200,
            sha: "3d0f52c1",
            content: `cmake_minimum_required(VERSION 3.10)
project(MiniGit)

set(CMAKE_CXX_STANDARD 17)

add_executable(minigit src/main.cpp)
`
        }
    ],
    "workspace_2": [
        {
            name: "app.py",
            path: "app.py",
            type: "file",
            size: 1200,
            sha: "4e1g63d2",
            content: `from flask import Flask, render_template, request, redirect, url_for
from datetime import datetime

app = Flask(__name__)

tasks = []

@app.route('/')
def index():
    return render_template('index.html', tasks=tasks)

@app.route('/add', methods=['POST'])
def add_task():
    task = request.form.get('task')
    if task:
        tasks.append({
            'id': len(tasks) + 1,
            'text': task,
            'created': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    return redirect(url_for('index'))

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
`
        },
        {
            name: "index.html",
            path: "templates/index.html",
            type: "file",
            size: 800,
            sha: "5f2h74e3",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Master</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
</head>
<body>
    <div class="container">
        <h1>Task Master</h1>
        <form action="/add" method="POST">
            <input type="text" name="task" placeholder="Add a new task..." required>
            <button type="submit">Add Task</button>
        </form>
        <ul class="task-list">
            {% for task in tasks %}
            <li>
                <span>{{ task.text }}</span>
                <a href="/delete/{{ task.id }}">Delete</a>
            </li>
            {% endfor %}
        </ul>
    </div>
</body>
</html>
`
        }
    ],
    "workspace_3": [
        {
            name: "App.jsx",
            path: "src/App.jsx",
            type: "file",
            size: 450,
            sha: "6g3i85f4",
            content: `import { RouterProvider } from "react-router-dom";
import router from "./routes";
import UserProvider from "./context/UserContext/UserProvider";

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
`
        },
        {
            name: "routes.jsx",
            path: "src/routes.jsx",
            type: "file",
            size: 600,
            sha: "7h4j96g5",
            content: `import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard/components/Dashboard';
import Repositories from './pages/Repositories/Repositories';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/repositories',
    element: <Repositories />,
  },
]);

export default router;
`
        }
    ],
    "workspace_4": [
        {
            name: "index.tsx",
            path: "src/index.tsx",
            type: "file",
            size: 500,
            sha: "8i5k07h6",
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
        }
    ]
};
