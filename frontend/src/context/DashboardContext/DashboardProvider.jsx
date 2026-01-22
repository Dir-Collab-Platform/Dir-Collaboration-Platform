import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/api';
import { DashboardContext } from './DashboardContext';
import { useSocket } from '../SocketContext/SocketContext';

export default function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [recentRepos, setRecentRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, isConnected } = useSocket();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, activityRes, heatmapRes, reposRes] = await Promise.all([
        apiRequest('/api/stats').catch(() => ({ status: 'error', data: null })),
        apiRequest('/api/activity/feed?limit=10'),
        apiRequest('/api/activity/heatmap'),
        apiRequest('/api/repos?limit=5').catch(() => ({ status: 'error', data: [] }))
      ]);

      if (statsRes.status === 'success') setStats(statsRes.data);
      if (activityRes.status === 'success') setActivityFeed(activityRes.data);
      if (heatmapRes.status === 'success') setHeatmapData(heatmapRes.data);
      if (reposRes.status === 'success') setRecentRepos(reposRes.data);

    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for stats_updated socket event to auto-refresh dashboard
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleStatsUpdated = (data) => {
      console.log('Stats updated event received:', data);
      // Refresh dashboard data when repository is imported
      fetchDashboardData();
    };

    socket.on('stats_updated', handleStatsUpdated);

    return () => {
      socket.off('stats_updated', handleStatsUpdated);
    };
  }, [socket, isConnected]);

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

  const value = {
    stats,
    setStats,
    activityFeed,
    setActivityFeed,
    heatmapData,
    setHeatmapData,
    recentRepos,
    refreshActivityFeed,
    refreshDashboard: fetchDashboardData,
    isLoading,
    error
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
