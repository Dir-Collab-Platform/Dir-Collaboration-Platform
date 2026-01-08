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

function DashboardContent() {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { stats, activityFeed, heatmapData } = useContext(DashboardContext);

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
          <div className="relative cursor-pointer" onClick={() => setShowNotificationPanel(!showNotificationPanel)}>
            <Bell size={24} style={{ color: 'var(--secondary-text-color)' }} />
            <span className="absolute -top-1 -right-1 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--notification-count-bg)' }}>
              {stats?.unreadNotifications || 0}
            </span>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-10 pb-10 scroll-bar">
          <div className="max-w-[1200px] mx-auto space-y-8">
            <StatsOverview />
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <ActivityFeed />
              </div>
              <div>
                <RecentRepositories />
              </div>
            </div>

            <ContributionSummary />

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
              notifications={[]}
              pastNotifications={[]}
              expandedMessages={{}}
              isLoadingPast={false}
              onClose={() => setShowNotificationPanel(false)}
              onMarkAllAsRead={() => {}}
              onCloseNotification={() => {}}
              onActionButton={() => {}}
              onToggleMessageExpansion={() => {}}
              onLoadPastNotifications={() => {}}
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
