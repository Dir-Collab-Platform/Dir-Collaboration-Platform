import { useState, useEffect } from 'react';
import axios from 'axios';
import { ExploreContext } from './ExploreContext';
import { mockAllRepos, mockTopics, mockLanguages, mockUsers } from '../../data/mockData';

export default function ExploreProvider({ children }) {
  const [repos, setRepos] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchExploreData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API calls when integrating backend
        // const [reposRes, tagsRes] = await Promise.all([
        //   axios.get('/api/repos/explore', { params: { page: 1 } }),
        //   axios.get('/api/repos/topics')
        // ]);
        // setRepos(reposRes.data.data.repos);
        // setTags(tagsRes.data.data);
        // setHasNextPage(reposRes.data.data.hasNextPage);

        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 500));
        setTags(mockTopics);

        // Enrich repos with languages and member avatars
        const enrichedRepos = mockAllRepos.map(repo => {
          const languages = mockLanguages[repo._id] || [];
          const memberAvatars = repo.members?.slice(0, 4).map(mem => {
            const user = mockUsers.find(u => u._id === mem.userId);
            return user?.avatarUrl || "https://via.placeholder.com/40";
          }) || [];

          return {
            ...repo,
            languages,
            avatar: repo.members?.[0] ? mockUsers.find(u => u._id === repo.members[0].userId)?.avatarUrl : "https://via.placeholder.com/40",
            collaborators: memberAvatars,
            stars: Math.floor(Math.random() * 300),
            visibility: repo.isPrivate ? "private" : "public"
          };
        });

        setRepos(enrichedRepos);
        setHasNextPage(false);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch explore data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExploreData();
  }, []);

  const searchRepos = async (query, filter = 'all', selectedTag = '', pageNum = 1) => {
    try {
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.get('/api/repos/explore', {
      //   params: { query, filter, tag: selectedTag, page: pageNum }
      // });
      // return response.data;

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      let filtered = [...mockAllRepos];

      if (filter === 'workspace') {
        filtered = filtered.filter(repo => repo.isImported);
      } else if (filter === 'repository') {
        filtered = filtered.filter(repo => !repo.isImported);
      }

      if (selectedTag) {
        const tagName = selectedTag.toLowerCase();
        filtered = filtered.filter(repo =>
          repo.tags?.some(tag => tag.toLowerCase() === tagName) ||
          repo.tags?.some(tag => mockTopics.find(t => t.name === tagName)?.label === tag)
        );
      }

      if (query) {
        filtered = filtered.filter(repo =>
          repo.githubRepoName.toLowerCase().includes(query.toLowerCase()) ||
          repo.description?.toLowerCase().includes(query.toLowerCase())
        );
      }

      // Enrich with languages and avatars
      const enriched = filtered.map(repo => {
        const languages = mockLanguages[repo._id] || [];
        const memberAvatars = repo.members?.slice(0, 4).map(mem => {
          const user = mockUsers.find(u => u._id === mem.userId);
          return user?.avatarUrl || "https://via.placeholder.com/40";
        }) || [];

        return {
          ...repo,
          languages,
          avatar: repo.members?.[0] ? mockUsers.find(u => u._id === repo.members[0].userId)?.avatarUrl : "https://via.placeholder.com/40",
          collaborators: memberAvatars,
          stars: Math.floor(Math.random() * 300),
          visibility: repo.isPrivate ? "private" : "public"
        };
      });

      return {
        status: 'success',
        data: {
          repos: enriched,
          hasNextPage: false
        }
      };
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    repos,
    setRepos,
    tags,
    setTags,
    searchRepos,
    page,
    setPage,
    hasNextPage,
    setHasNextPage,
    isLoading,
    error
  };

  return (
    <ExploreContext.Provider value={value}>
      {children}
    </ExploreContext.Provider>
  );
}
