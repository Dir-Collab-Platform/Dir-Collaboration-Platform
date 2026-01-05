// Mocking the backend responses provided in the requirements
export const fetchExploreRepos = async (page = 1, query = "", tag = "") => { // eslint-disable-line no-unused-vars
  // Simulate a slight network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let baseRepos = [
    // PAGE 1
    {
      githubId: "1",
      name: "Dir-Platform",
      owner: "boanergase",
      avatar: "https://avatars.githubusercontent.com/u/1",
      description: "A developer-focused platform designed to help users discover software repositories.",
      stars: 300,
      tags: ["javascript", "web-development"],
      languages: [
        { label: "JavaScript", value: 50, color: "#f1e05a" },
        { label: "HTML", value: 18, color: "#e34c26" },
        { label: "CSS", value: 32, color: "#563d7c" }
      ],
      visibility: "public"
    },
    {
      githubId: "2",
      name: "Traffic-Management",
      owner: "EfrataHabte",
      avatar: "https://avatars.githubusercontent.com/u/2",
      description: "Traffic system management dashboard for urban infrastructure.",
      stars: 140,
      tags: ["rust", "system-programming"],
      languages: [
        { label: "Rust", value: 50.3, color: "#dea584" },
        { label: "C", value: 16.3, color: "#555555" },
        { label: "Zig", value: 33.4, color: "#ec915c" }
      ],
      visibility: "public"
    },
    // PAGE 2
    {
      githubId: "3",
      name: "AI-Assistant",
      owner: "johndoe",
      avatar: "https://avatars.githubusercontent.com/u/3",
      description: "An AI-powered assistant for developers.",
      stars: 450,
      tags: ["python", "ai"],
      languages: [
        { label: "Python", value: 70, color: "#3572A5" },
        { label: "JavaScript", value: 30, color: "#f1e05a" }
      ],
      visibility: "public"
    },
    {
      githubId: "4",
      name: "Blockchain-Explorer",
      owner: "cryptodev",
      avatar: "https://avatars.githubusercontent.com/u/4",
      description: "Explore blockchain transactions and data.",
      stars: 200,
      tags: ["blockchain", "javascript"],
      languages: [
        { label: "JavaScript", value: 60, color: "#f1e05a" },
        { label: "Solidity", value: 40, color: "#AA6746" }
      ],
      visibility: "public"
    },
    // PAGE 3
    {
      githubId: "5",
      name: "Agri-Tech",
      owner: "GreenThumb",
      isWorkspace: true,
      avatar: "https://avatars.githubusercontent.com/u/5",
      description: "Smart monitoring for agricultural soil and crops.",
      stars: 95,
      tags: ["agriculture", "iot"],
      languages: [
        { label: "Python", value: 80, color: "#3572A5" },
        { label: "C++", value: 20, color: "#f34b7d" }
      ],
      visibility: "public"
    },
    {
      githubId: "6",
      name: "Health-Sync",
      owner: "VitalSigns",
      isWorkspace: false,
      avatar: "https://avatars.githubusercontent.com/u/6",
      description: "Real-time health tracking and data synchronization.",
      stars: 310,
      tags: ["health", "web-development"],
      languages: [
        { label: "TypeScript", value: 100, color: "#3178c6" }
      ],
      visibility: "public"
    },
    // PAGE 4
    {
      githubId: "7",
      name: "Cloud-Native-Ops",
      owner: "DevOpsPro",
      isWorkspace: true,
      avatar: "https://avatars.githubusercontent.com/u/7",
      description: "Kubernetes orchestration and monitoring tools.",
      stars: 520,
      tags: ["go", "cloud"],
      languages: [
        { label: "Go", value: 90, color: "#00ADD8" },
        { label: "Shell", value: 10, color: "#89e051" }
      ],
      visibility: "public"
    },
    {
      githubId: "8",
      name: "Ethio-Fintech",
      owner: "AbyssiniaDev",
      isWorkspace: true,
      avatar: "https://avatars.githubusercontent.com/u/8",
      description: "Local payment gateway integration for Ethiopia.",
      stars: 180,
      tags: ["php", "fintech"],
      languages: [
        { label: "PHP", value: 70, color: "#4F5D95" },
        { label: "JavaScript", value: 30, color: "#f1e05a" }
      ],
      visibility: "public"
    }
  ];

  // Filter based on query
  if (query === "repository") {
    baseRepos = baseRepos.filter(repo => !repo.isWorkspace);
  } else if (query === "workspace") {
    baseRepos = baseRepos.filter(repo => repo.isWorkspace);
  }
  // for "all" or empty, show all

  const startIndex = (page - 1) * 2;
  const endIndex = startIndex + 3;
  const repos = baseRepos.slice(startIndex, endIndex);

  return {
    status: "success",
    data: {
      total: 100,
      repos: repos,
      hasNextPage: endIndex < baseRepos.length
    }
  };
};

export const fetchTopics = async () => {
  return {
    status: "success",
    data: [
      { name: "health", label: "Health", color: "#10b981" },
      { name: "agriculture", label: "Agriculture", color: "#059669" },
      { name: "javascript", label: "JavaScript", color: "#f1e05a" },
      { name: "web-development", label: "Web Development", color: "#4b5563" },
      { name: "rust", label: "Rust", color: "#dea584" },
      { name: "python", label: "Python", color: "#3572A5" },
      { name: "ai", label: "AI", color: "#8b5cf6" },
      { name: "blockchain", label: "Blockchain", color: "#f59e0b" }
    ]
  };
};

// Mock storage for custom tags (in a real app, this would be in a database)
let customTags = [];

export const createCustomTag = async (tagName) => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate delay

  // Mocking POST /api/repos/topics response
  const newTag = {
    _id: Math.random().toString(36).substr(2, 9), // Generate fake Mongo-like ID
    name: tagName.toLowerCase().replace(/\s+/g, '-'),
    label: tagName,
    color: "#4f46e5", // Default theme color
    createdBy: "current-user-id"
  };

  customTags.push(newTag);

  return {
    status: "success",
    data: newTag
  };
};

export const deleteCustomTag = async (tagId) => {
  await new Promise(resolve => setTimeout(resolve, 400));

  // Find the tag in custom tags
  const tagIndex = customTags.findIndex(tag => tag._id === tagId);

  if (tagIndex === -1) {
    return {
      status: "error",
      message: "Tag not found or cannot be deleted"
    };
  }

  // Remove the tag
  customTags.splice(tagIndex, 1);

  // Mocking DELETE /api/repos/topics/:id response
  return {
    status: "success",
    message: "tag removed successfully"
  };
};