import React from 'react';

const StatsOverview = ({ stats }) => {
  const cards = [
    { label: "Total Repositories", value: stats?.githubTotalCount ?? 0 },
    { label: "Total Workspaces", value: stats?.activeWorkspacesCount ?? 0 },
    { label: "Total Tasks", value: stats?.totalTasks ?? 0 },
    { label: "Unread Notifications", value: stats?.unreadNotifications ?? 0 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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