import { useState, useEffect } from 'react';
import axios from 'axios';
import { RepositoriesContext } from './RepositoriesContext';
import { mockRepositories } from '../../data/mockData';

export default function RepositoriesProvider({ children }) {
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call when integrating backend
        // const response = await axios.get('/api/repos');
        // setRepositories(response.data.data);

        // Mock implementation - only repos that are NOT workspaces
        await new Promise(resolve => setTimeout(resolve, 400));
        setRepositories(mockRepositories);
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
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.post('/api/repos', repoData);
      // setRepositories(prev => [...prev, response.data.data]);

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      const newRepo = {
        _id: `repo_${Date.now()}`,
        ...repoData,
        isImported: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setRepositories(prev => [...prev, newRepo]);
      return newRepo;
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
