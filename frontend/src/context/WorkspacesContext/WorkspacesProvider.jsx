import React, { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';
import { WorkspacesContext } from './WorkspacesContext';

export default function WorkspacesProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch the list of all joined/owned workspaces
  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("/api/repos");
      
      if (response.status === "success") {
        const rawWorkspaces = response.data || [];

        // --- STEP 1: RENDER IMMEDIATELY ---
        // Prepare the basic data and show it NOW
        const initialWorkspaces = rawWorkspaces.map(ws => ({
          ...ws,
          stars: typeof ws.stars === "number" ? ws.stars : parseInt(ws.stars) || 0,
          languages: {} // Placeholder to prevent UI crashes
        }));

        setWorkspaces(initialWorkspaces); 
        setIsLoading(false); // <--- STOP LOADING SPINNER HERE

        // --- STEP 2: FETCH DETAILS IN BACKGROUND ---
        // Now fetch languages silently while the user looks at the list
        const workspacesWithLanguages = await Promise.all(
          initialWorkspaces.map(async (ws) => {
            if (!ws._id) return ws;
            try {
              const langRes = await apiRequest(
                `/api/repos/languages?workspaceId=${ws._id}`
              );
              return {
                ...ws,
                languages: langRes.status === "success" ? langRes.data : {},
              };
            } catch (e) {
              console.warn(`Background fetch failed for ${ws.workspaceName}`, e);
              return ws;
            }
          })
        );

        // --- STEP 3: UPDATE AGAIN ---
        // Update the list with the colorful language bars
        setWorkspaces(workspacesWithLanguages);
      }
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch workspaces:", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const getWorkspace = (id) => {
    return workspaces.find((ws) => ws._id === id);
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
    fetchWorkspaces
  };

  return (
    <WorkspacesContext.Provider value={value}>
      {children}
    </WorkspacesContext.Provider>
  );
}