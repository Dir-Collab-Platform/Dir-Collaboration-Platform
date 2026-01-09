import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';
import { DashboardContext } from './DashboardContext';

export default function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recentRepos, setRecentRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsRes, activityRes, heatmapRes, notifRes, reposRes] = await Promise.all([
          apiRequest('/api/stats').catch(() => ({ status: 'error', data: null })), // Corrected endpoint
          apiRequest('/api/activity/feed?limit=10'),
          apiRequest('/api/activity/heatmap'),
          apiRequest('/api/notifications'),
          apiRequest('/api/repos?limit=5').catch(() => ({ status: 'error', data: [] }))
        ]);

        if (statsRes.status === 'success') setStats(statsRes.data);
        if (activityRes.status === 'success') setActivityFeed(activityRes.data);
        if (heatmapRes.status === 'success') setHeatmapData(heatmapRes.data);
        if (notifRes.status === 'success') setNotifications(notifRes.data);
        if (reposRes.status === 'success') setRecentRepos(reposRes.data);

      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const refreshActivityFeed = async () => {
    try {
      const response = await apiRequest('/api/activity/feed?limit=10');
      if (response.status === 'success') {
        setActivityFeed(response.data);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const markNotificationRead = async (id) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification read', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiRequest(`/api/notifications/${id}`, { method: 'DELETE' });
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const value = {
    stats,
    setStats,
    activityFeed,
    setActivityFeed,
    heatmapData,
    setHeatmapData,
    notifications,
    recentRepos,
    refreshActivityFeed,
    markNotificationRead,
    deleteNotification,
    isLoading,
    error
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
