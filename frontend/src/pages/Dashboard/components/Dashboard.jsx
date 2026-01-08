import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import StatsOverview from './StatsOverview';
import ActivityFeed from './ActivityFeed';
import RecentRepositories from './RecentRepositories';
import ContributionSummary from './ContributionSummary';
import NotificationPanel from '../../../common-components/Header/components/NotificationPanel';
import { Bell } from 'lucide-react';
import { DashboardContext } from '../../../context/DashboardContext/DashboardContext';
import DashboardProvider from '../../../context/DashboardContext/DashboardProvider';

import { mockNotifications, mockPastNotifications } from '../../../data/mockData';

function DashboardContent() {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { stats, activityFeed, heatmapData, isLoading } = useContext(DashboardContext);

  // Notification states
  const [notifications, setNotifications] = useState(mockNotifications);
  const [pastNotifications, setPastNotifications] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [isLoadingPast, setIsLoadingPast] = useState(false);

  // Show loader while fetching dashboard data
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0D0D19] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3">Loading Dashboard...</span>
      </div>
    );
  }

  // Notification Handlers
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const handleCloseNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleLoadPastNotifications = () => {
    setIsLoadingPast(true);
    setTimeout(() => {
      setPastNotifications(prev => [...mockPastNotifications, ...prev]);
      setIsLoadingPast(false);
    }, 1200);
  };

  const handleActionButton = (action, notificationId) => {
    switch (action.toLowerCase()) {
      case 'mark as read':
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        break;
      case 'reject':
      case 'ignore':
        handleCloseNotification(notificationId);
        break;
      default:
        break;
    }
  };

  const toggleMessageExpansion = (notificationId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId]
    }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden -mt-20 scroll-bar" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* Sidebar - Fixed Width */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-end px-10">
          <div className="relative cursor-pointer" onClick={(e) => { e.stopPropagation(); setShowNotificationPanel(!showNotificationPanel); }}>
            <Bell size={24} style={{ color: 'var(--secondary-text-color)' }} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--notification-count-bg)' }}>
                {notifications.length}
              </span>
            )}
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-10 pb-10 scroll-bar">
          <div className="max-w-[1200px] mx-auto space-y-8">
            <StatsOverview stats={stats} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ActivityFeed activities={activityFeed} />
              </div>
              <div>
                <RecentRepositories />
              </div>
            </div>

            <ContributionSummary heatmapData={heatmapData} />

            <footer className="pt-10 flex justify-center gap-6 text-xs" style={{ color: 'var(--secondary-text-color)' }}>
              <span>Dir 2025 © All rights reserved.</span>
              <span className="cursor-pointer hover:opacity-80">Docs</span>
              <span className="cursor-pointer hover:opacity-80">Terms of use</span>
              <span className="cursor-pointer hover:opacity-80">Privacy</span>
            </footer>
          </div>
        </main>
      </div>

      {showNotificationPanel && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setShowNotificationPanel(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <NotificationPanel
              notifications={notifications}
              pastNotifications={pastNotifications}
              expandedMessages={expandedMessages}
              isLoadingPast={isLoadingPast}
              onClose={() => setShowNotificationPanel(false)}
              onMarkAllAsRead={handleMarkAllAsRead}
              onCloseNotification={handleCloseNotification}
              onActionButton={handleActionButton}
              onToggleMessageExpansion={toggleMessageExpansion}
              onLoadPastNotifications={handleLoadPastNotifications}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const Dashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Dashboard;
