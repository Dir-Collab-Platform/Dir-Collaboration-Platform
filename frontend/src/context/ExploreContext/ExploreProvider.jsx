import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../services/api/api';
import { ExploreContext } from './ExploreContext';
import { fetchExploreRepos, fetchTopics, createRemoteRepo as createRemoteRepoService } from '../../pages/Explore/api/repoService';

export default function ExploreProvider({ children }) {
  const [repos, setRepos] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial Fetch: Topics and Page 1
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [reposRes, tagsRes] = await Promise.all([
          fetchExploreRepos(1),
          fetchTopics()
        ]);

        if (reposRes.status === 'success') {
          setRepos(reposRes.data.repos || []);
        }

        if (tagsRes.status === 'success') {
          setTags(tagsRes.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const searchRepos = useCallback(async (query, filter = 'all', selectedTag = '', pageNum = 1) => {
    try {
      return await fetchExploreRepos(pageNum, query, selectedTag, filter);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const handleCreateRemoteRepo = async (repoData) => {
    try {
      setIsLoading(true);
      const res = await createRemoteRepoService(repoData);
      if (res.status === 'success') {
        // Optionally update local list or just return
        return res.data;
      }
      throw new Error(res.message);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTag = async (repoId, tagName) => {
    try {
      const response = await apiRequest(`/api/repos/${repoId}/tags`, {
        method: 'POST',
        body: JSON.stringify({ name: tagName })
      });

      if (response.status === 'success') {
        const updatedRepo = response.data;
        // Optimistic UI update
        setRepos(prev => prev.map(repo =>
          repo._id === repoId ? { ...repo, tags: updatedRepo.tags } : repo
        ));
        return true;
      }
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const value = {
    repos, setRepos,
    tags, setTags,
    searchRepos,
    handleCreateTag,
    handleCreateRemoteRepo,
    isLoading, error
  };

  return (
    <ExploreContext.Provider value={value}>
      {children}
    </ExploreContext.Provider>
  );
}