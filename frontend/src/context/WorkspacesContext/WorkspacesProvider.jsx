import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';
import { WorkspacesContext } from './WorkspacesContext';


export default function WorkspacesProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchWorkspaces();
  }, []);

  const getWorkspace = (workspaceId) => {
    return workspaces.find(ws => ws._id === workspaceId);
  };

  const createWorkspace = async (workspaceData) => {
    try {
      // FIX: Ensure body is stringified for fetch
      const response = await apiRequest("/api/repos/create-workspace", {
        method: "POST",
        body: JSON.stringify(workspaceData), // <--- Added JSON.stringify
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
    isLoading,
    error,
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
