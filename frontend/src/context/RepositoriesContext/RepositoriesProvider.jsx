import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';
import { RepositoriesContext } from './RepositoriesContext';


export default function RepositoriesProvider({ children }) {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest('/api/repos/discovery');
        if (response.status === 'success') {
          const initialRepos = response.data;
          setRepositories(initialRepos);

          // Fetch detailed languages for each repo in parallel
          const reposWithLanguages = await Promise.all(
            initialRepos.map(async (repo) => {
              // Only fetch detailed languages if it's an imported workspace with an ID
              if (!repo._id || !repo.isImported) {
                return repo;
              }
              try {
                const langRes = await apiRequest(`/api/repos/languages?workspaceId=${repo._id}`);
                return {
                  ...repo,
                  languages: langRes.status === 'success' ? langRes.data : []
                };
              } catch (e) {
                console.warn(`Failed to fetch languages for ${repo.workspaceName}`, e);
                return repo;
              }
            })
          );

          setRepositories(reposWithLanguages);
        }
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch repositories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const getRepository = (repoId) => {
    return repositories.find(repo => repo._id === repoId);
  };

  const createRepository = async (repoData) => {
    try {
      // Determine if import or create
      const endpoint = repoData.isImport ? '/api/repos/import' : '/api/repos/create-remote';
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(repoData)
      });

      if (response.status === 'success' || response.status === 'created') {
        const newRepo = response.data;
        // Optimistically add to list (re-fetch would be cleaner but this is faster)
        setRepositories(prev => [...prev, newRepo]);
        return newRepo;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    repositories,
    setRepositories,
    getRepository,
    createRepository,
    isLoading,
    error
  };

  return (
    <RepositoriesContext.Provider value={value}>
      {children}
    </RepositoriesContext.Provider>
  );
}
