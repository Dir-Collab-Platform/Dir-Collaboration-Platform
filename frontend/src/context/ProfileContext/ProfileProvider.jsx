import { useState, useEffect } from 'react';
import { ProfileContext } from './ProfileContext';
import { apiRequest } from '../../services/api/api';

export default function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest('/api/me');
        if (response.status === 'success') {
          setProfile(response.data);
        }
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
      // Backend endpoint: PATCH /api/profile (per API_DOCUMENTATION.md)
      const response = await apiRequest('/api/profile', {
        method: 'PATCH',
        body: profileData
      });

      if (response.status === 'success') {
        setProfile(prev => ({ ...prev, ...profileData }));
      }
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updatePreferences = async (preferences) => {
    // Implement if backend supports it, otherwise keep as placeholder or local state
    console.warn("Preferences update not fully implemented in backend yet");
    setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, ...preferences } }));
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
