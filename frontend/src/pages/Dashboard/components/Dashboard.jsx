import Sidebar from './Sidebar';
import StatsOverview from './StatsOverview';
import ActivityFeed from './ActivityFeed';
import RecentRepositories from './RecentRepositories';
import ContributionSummary from './ContributionSummary';
import NotificationBell from '../../../common-components/Header/components/NotificationBell';
import { DashboardContext } from '../../../context/DashboardContext/DashboardContext';
import { useContext } from 'react';

function DashboardContent() {
  const { stats, activityFeed, heatmapData, isLoading } = useContext(DashboardContext);

  // Show loader while fetching dashboard data
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0D0D19] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3">Loading Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden -mt-20 scroll-bar" style={{ backgroundColor: 'var(--dark-bg)' }}>
      {/* Sidebar - Fixed Width */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-end px-10 pt-10">
          <NotificationBell />
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
    </div>
  );
}

const Dashboard = () => {
  return <DashboardContent />;
};

export default Dashboard;
