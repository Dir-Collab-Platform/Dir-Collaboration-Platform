import { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardContext } from './DashboardContext';
import { mockStats, mockActivityFeed, mockHeatmapData } from '../../data/mockData';

export default function DashboardProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API calls when integrating backend
        // const [statsRes, activityRes, heatmapRes] = await Promise.all([
        //   axios.get('/api/stats'),
        //   axios.get('/api/activity/feed'),
        //   axios.get('/api/activity/heatmap')
        // ]);
        // setStats(statsRes.data.data);
        // setActivityFeed(activityRes.data.data);
        // setHeatmapData(heatmapRes.data.data);

        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 600));
        console.log('DashboardProvider: Setting mock data', { mockStats, mockActivityFeed, mockHeatmapData });
        setStats(mockStats);
        setActivityFeed(mockActivityFeed);
        setHeatmapData(mockHeatmapData);
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
      // TODO: Replace with real API call when integrating backend
      // const response = await axios.get('/api/activity/feed');
      // setActivityFeed(response.data.data);

      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 400));
      setActivityFeed(mockActivityFeed);
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
    refreshActivityFeed,
    isLoading,
    error
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
