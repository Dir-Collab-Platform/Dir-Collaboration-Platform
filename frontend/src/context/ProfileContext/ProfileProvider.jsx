import { useState, useEffect } from 'react';
import axios from 'axios';
import { ProfileContext } from './ProfileContext';
import { mockUser } from '../../data/mockData';

export default function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call when integrating backend
        // const response = await axios.get('/api/me');
        // setProfile(response.data.data);
        
        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 300));
        setProfile(mockUser);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (profileData) => {
    try {
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.patch('/api/profile', profileData);
      // setProfile(response.data.data);
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      setProfile(prev => ({ ...prev, ...profileData }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.put('/api/notifications/preferences', preferences);
      // setProfile(prev => ({ ...prev, preferences: response.data.data }));
      
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 300));
      setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, ...preferences } }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    profile,
    setProfile,
    updateProfile,
    updatePreferences,
    isLoading,
    error
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
