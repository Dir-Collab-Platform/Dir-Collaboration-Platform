import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';
import { ExploreContext } from './ExploreContext';


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
        const [reposRes, tagsRes] = await Promise.all([
          apiRequest('/api/repos/explore?page=1'),
          apiRequest('/api/repos/topics')
        ]);

        if (reposRes.status === 'success') {
          setRepos(reposRes.data.repos || []);
          setHasNextPage(reposRes.data.hasNextPage);
        }

        if (tagsRes.status === 'success') {
          setTags(tagsRes.data);
        }

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
      const response = await apiRequest('/api/repos/explore', {
        params: { search: query, filter, tag: selectedTag, page: pageNum }
      });
      return response;
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
