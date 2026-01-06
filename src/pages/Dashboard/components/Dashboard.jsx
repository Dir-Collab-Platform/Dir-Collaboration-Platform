import React, { useState } from 'react';
import Sidebar from './Sidebar';
import StatsOverview from './StatsOverview';
import ActivityFeed from './ActivityFeed';
import RecentRepositories from './RecentRepositories';
import ContributionSummary from './ContributionSummary';
import NotificationPanel from '../../../common-components/Header/components/NotificationPanel';
import { Bell } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    type: 'github',
    label: 'GitHub',
    time: '2m ago',
    repo: 'my-project',
    user: 'You',
    shortPR: 'Created repository "my-project"',
    fullPR: 'Successfully created a new repository named "my-project" with initial setup.',
    hasMore: false,
    read: false
  },
  {
    id: '2',
    type: 'alert',
    label: 'System',
    time: '1h ago',
    repo: 'main-branch',
    shortAlert: 'Pull request #42 merged',
    fullAlert: 'Pull request #42 has been successfully merged into the main branch by the repository maintainer.',
    hasMore: false,
    read: false
  }
];

const Dashboard = () => {
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#0D0D12] overflow-hidden">
      {/* Sidebar - Fixed Width */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-end px-10">
          <div className="relative cursor-pointer" onClick={() => setShowNotificationPanel(!showNotificationPanel)}>
            <Bell size={24} className="text-gray-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              6
            </span>
          </div>
        </header>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
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

            <footer className="pt-10 flex justify-center gap-6 text-xs text-gray-600">
              <span>Dir 2025 © All rights reserved.</span>
              <span className="cursor-pointer hover:text-gray-400">Docs</span>
              <span className="cursor-pointer hover:text-gray-400">Tems of use</span>
              <span className="cursor-pointer hover:text-gray-400">Privacy</span>
            </footer>
          </div>
        </main>
      </div>

      {showNotificationPanel && (
        <NotificationPanel
          notifications={mockNotifications}
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
      )}
    </div>
  );
};

export default Dashboard;