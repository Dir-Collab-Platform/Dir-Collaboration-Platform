import React from 'react';

const StatsOverview = ({ stats }) => {
  const cards = [
    { label: "Total Repositories", value: stats?.githubTotalCount ?? 10 },
    { label: "Total Workspaces", value: stats?.activeWorkspacesCount ?? 10 },
    { label: "Open Pull requests", value: 10 },
    { label: "Open Pull requests", value: 10 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-[#1D1D29] rounded-xl p-8 border border-white/5">
          <p className="text-sm text-gray-400 mb-4">{card.label}</p>
          <p className="text-5xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;