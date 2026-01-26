import React, { useContext } from 'react';
import { NotificationContext } from '../../../context/NotificationContext/NotificationContext';

const StatsOverview = ({ stats }) => {
  const { notificationsEnabled } = useContext(NotificationContext);

  const cards = [
    { label: "Total Repositories", value: stats?.githubTotalCount ?? 0 },
    { label: "Total Workspaces", value: stats?.activeWorkspacesCount ?? 0 },
    { label: "Total Tasks", value: stats?.totalTasks ?? 0 },
  ];

  // Only show notifications card if they are enabled in preferences
  if (notificationsEnabled) {
    cards.push({
      label: "Unread Notifications",
      value: stats?.unreadNotifications ?? 0
    });
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cards.length} gap-4`}>
      {cards.map((card, i) => (
        <div key={i} className="bg-(--bg-card) rounded-xl p-8 border border-white/5 shadow-sm">
          <p className="text-sm text-(--text-dim) mb-4">{card.label}</p>
          <p className="text-5xl font-bold text-(--text-primary)">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;