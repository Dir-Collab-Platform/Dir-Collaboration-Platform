import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { mockUser } from '../../data/mockData';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call when integrating backend
        // const response = await axios.get('/api/me');
        // setUser(response.data.data);
        
        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(mockUser);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = async (userData) => {
    try {
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.patch('/api/profile', userData);
      // setUser(response.data.data);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      setUser(prev => ({ ...prev, ...userData }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    setUser,
    updateUser,
    isLoading,
    error
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
