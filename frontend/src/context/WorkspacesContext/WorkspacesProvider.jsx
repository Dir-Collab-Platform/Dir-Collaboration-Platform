import { useState, useEffect } from 'react';
import axios from 'axios';
import { WorkspacesContext } from './WorkspacesContext';
import { mockWorkspaces } from '../../data/mockData';

export default function WorkspacesProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call when integrating backend
        // const response = await axios.get('/api/repos?isWorkspace=true');
        // setWorkspaces(response.data.data);
        
        // Mock implementation - only repos that ARE workspaces
        await new Promise(resolve => setTimeout(resolve, 400));
        setWorkspaces(mockWorkspaces);
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
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.post('/api/repos', { ...workspaceData, isWorkspace: true });
      // setWorkspaces(prev => [...prev, response.data.data]);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      const newWorkspace = {
        _id: `workspace_${Date.now()}`,
        ...workspaceData,
        isWorkspace: true,
        channels: [{ channel_id: `ch_${Date.now()}`, name: "general", _id: `ch_${Date.now()}`, created_at: new Date().toISOString(), participants: [] }],
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setWorkspaces(prev => [...prev, newWorkspace]);
      return newWorkspace;
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
