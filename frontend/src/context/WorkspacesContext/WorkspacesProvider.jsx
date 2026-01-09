import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // Required for ID and Preview
import { apiRequest } from '../../services/api/api';
import { WorkspacesContext } from './WorkspacesContext';

export default function WorkspacesProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current context from URL if applicable
  const { id: workspaceId } = useParams(); 
  const location = useLocation();
  const repoPreview = location.state?.repoData;

  // Function to fetch the list of all joined/owned workspaces
  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest('/api/repos'); // Assuming this endpoint lists user repos
      if (res.status === 'success') {
        setWorkspaces(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const getWorkspace = (id) => {
    return workspaces.find(ws => ws._id === id);
  };

  const createWorkspace = async (workspaceData) => {
    try {
      const response = await apiRequest('/api/repos/create-workspace', {
        method: 'POST',
        body: workspaceData
      });

      if (response.status === 'success' || response.status === 'created') {
        const newWorkspace = response.data;
        setWorkspaces(prev => [...prev, newWorkspace]);
        return newWorkspace;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    workspaces,
    setWorkspaces,
    getWorkspace,
    createWorkspace,
    isLoading,
    error,
    refreshWorkspaces: fetchWorkspaces
  };

  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
}