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
    setIsLoading(true);
    try {
      const response = await apiRequest('/api/repos');
      if (response.status === 'success') {
        const initialWorkspaces = response.data;
        setWorkspaces(initialWorkspaces);

        // Fetch detailed languages for each workspace in parallel
        const workspacesWithLanguages = await Promise.all(
          initialWorkspaces.map(async (ws) => {
            if (!ws._id) return ws;
            try {
              const langRes = await apiRequest(`/api/repos/languages?workspaceId=${ws._id}`);
              return {
                ...ws,
                languages: langRes.status === 'success' ? langRes.data : []
              };
            } catch (e) {
              console.warn(`Failed to fetch languages for ${ws.workspaceName}`, e);
              return ws;
            }
          })
        );

        setWorkspaces(workspacesWithLanguages);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch workspaces:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const getWorkspace = (workspaceId) => {
    return workspaces.find(ws => ws._id === workspaceId);
  };

  const createWorkspace = async (workspaceData) => {
    try {
      const response = await apiRequest("/api/repos/create-workspace", {
        method: "POST",
        body: workspaceData,
      });

      if (response.status === "success" || response.status === "created") {
        const newWorkspace = response.data;
        setWorkspaces((prev) => [...prev, newWorkspace]);
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
    error
  };

  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
}