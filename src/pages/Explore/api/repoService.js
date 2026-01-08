import languageColors from './languageColors';

export const fetchExploreRepos = async (page = 1, query = "", tag = "") => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let baseRepos = [
    {
      githubId: "1",
      name: "Dir-Platform",
      owner: "boanergase",
      isImported: true,
      avatar: "https://avatars.githubusercontent.com/u/1",
      description: "A developer-focused platform designed to help users discover software repositories.",
      stars: 300,
      tags: ["javascript", "web-development"],
      languages: [{ label: "JavaScript", value: 50 }, { label: "HTML", value: 18 }, { label: "CSS", value: 32 }],
      visibility: "public"
    },
    {
      githubId: "2",
      name: "Traffic-Management",
      owner: "EfrataHabte",
      isImported: true,
      avatar: "https://avatars.githubusercontent.com/u/2",
      description: "Traffic system management dashboard for urban infrastructure.",
      stars: 140,
      tags: ["rust", "system-programming"],
      languages: [{ label: "Rust", value: 50.3 }, { label: "C", value: 16.3 }, { label: "Zig", value: 33.4 }],
      visibility: "public"
    },
    {
      githubId: "3",
      name: "AI-Assistant",
      owner: "johndoe",
      isImported: false,
      avatar: "https://avatars.githubusercontent.com/u/3",
      description: "An AI-powered assistant for developers.",
      stars: 450,
      tags: ["python", "ai"],
      languages: [{ label: "Python", value: 70 }, { label: "JavaScript", value: 30 }],
      visibility: "public"
    },
    {
      githubId: "4",
      name: "Blockchain-Explorer",
      owner: "cryptodev",
      isImported: true,
      avatar: "https://avatars.githubusercontent.com/u/4",
      description: "Explore blockchain transactions and data.",
      stars: 200,
      tags: ["blockchain", "javascript"],
      languages: [{ label: "JavaScript", value: 60 }, { label: "Solidity", value: 40 }],
      visibility: "public"
    },
    {
      githubId: "5",
      name: "Agri-Tech",
      owner: "GreenThumb",
      isImported: true,
      avatar: "https://avatars.githubusercontent.com/u/5",
      description: "Smart monitoring for agricultural soil and crops.",
      stars: 95,
      tags: ["agriculture", "iot"],
      languages: [{ label: "Python", value: 80 }, { label: "C++", value: 20 }],
      visibility: "public"
    },
    {
      githubId: "6",
      name: "Health-Sync",
      owner: "VitalSigns",
      isImported: false,
      avatar: "https://avatars.githubusercontent.com/u/6",
      description: "Real-time health tracking and data synchronization.",
      stars: 310,
      tags: ["health", "web-development"],
      languages: [{ label: "TypeScript", value: 100 }],
      visibility: "public"
    },
    {
      githubId: "7",
      name: "Cloud-Native-Ops",
      owner: "DevOpsPro",
      isImported: true,
      avatar: "https://avatars.githubusercontent.com/u/7",
      description: "Kubernetes orchestration and monitoring tools.",
      stars: 520,
      tags: ["go", "cloud"],
      languages: [{ label: "Go", value: 90 }, { label: "Shell", value: 10 }],
      visibility: "public"
    },
    {
      githubId: "8",
      name: "Ethio-Fintech",
      owner: "AbyssiniaDev",
      isImported: true,
      avatar: "https://avatars.githubusercontent.com/u/8",
      description: "Local payment gateway integration for Ethiopia.",
      stars: 180,
      tags: ["php", "fintech"],
      languages: [{ label: "PHP", value: 70 }, { label: "JavaScript", value: 30 }],
      visibility: "public"
    }
  ];

  // 1. FILTER BY QUERY (Workspace/Repository)
  if (query === "repository") {
    baseRepos = baseRepos.filter(repo => !repo.isImported);
  } else if (query === "workspace") {
    baseRepos = baseRepos.filter(repo => repo.isImported);
  }

  // 2. FILTER BY TAG (?tag=health)
  if (tag) {
    baseRepos = baseRepos.filter(repo =>
      repo.tags && repo.tags.includes(tag.toLowerCase())
    );
  }

  // 3. PAGINATION
  const startIndex = (page - 1) * 2;
  const endIndex = startIndex + 2;
  const rawRepos = baseRepos.slice(startIndex, endIndex);

  // 4. MAP COLORS
  const repos = rawRepos.map(repo => ({
    ...repo,
    languages: repo.languages.map(lang => ({
      ...lang,
      color: languageColors[lang.label] || "#6b7280"
    }))
  }));

  return {
    status: "success",
    data: {
      total: baseRepos.length,
      repos: repos,
      hasNextPage: endIndex < baseRepos.length
    }
  };
};

export const fetchTopics = async () => {
  const defaultTags = [
    { name: "health", label: "Health", color: "#10b981" },
    { name: "agriculture", label: "Agriculture", color: "#059669" },
    { name: "javascript", label: "JavaScript", color: languageColors.JavaScript },
    { name: "web-development", label: "Web Development", color: "#4b5563" },
    { name: "rust", label: "Rust", color: languageColors.Rust },
    { name: "python", label: "Python", color: languageColors.Python },
    { name: "ai", label: "AI", color: "#8b5cf6" },
    { name: "blockchain", label: "Blockchain", color: "#f59e0b" }
  ];

  return {
    status: "success",
    data: [...defaultTags, ...customTags]
  };
};

let customTags = [];

export const createCustomTag = async (tagName, tagDescription, tagColor) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const newTag = {
    _id: Math.random().toString(36).substr(2, 9),
    name: tagName.toLowerCase().replace(/\s+/g, '-'),
    label: tagName,
    description: tagDescription || "Custom tag",
    color: tagColor || "#4f46e5",
    createdBy: "current-user-id"
  };

  customTags.push(newTag);
  return { status: "success", data: newTag };
};

export const deleteCustomTag = async (tagId) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const tagIndex = customTags.findIndex(tag => tag._id === tagId);
  if (tagIndex === -1) {
    return { status: "error", message: "Tag not found or cannot be deleted" };
  }
  customTags.splice(tagIndex, 1);
  return { status: "success", message: "tag removed successfully" };
};