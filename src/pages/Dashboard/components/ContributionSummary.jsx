import React from 'react';

const getColor = (count) => {
  if (!count) return 'bg-gray-800';
  if (count >= 7) return 'bg-green-400';
  if (count >= 5) return 'bg-green-500';
  if (count >= 3) return 'bg-green-700';
  return 'bg-green-900';
};

const ContributionSummary = ({ heatmapData = [] }) => {
  // Ensure we have data, otherwise fallback to empty array or placeholder
  const data = heatmapData.length > 0 ? heatmapData : [];

  return (
    <div className="bg-[#1D1D29] rounded-xl p-8 border border-white/5">
      <h3 className="text-xl font-bold text-white mb-8">Contributions</h3>
      <div className="w-full overflow-x-auto pb-4 scroll-bar">
        <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
          {data.map((day, i) => (
            <div
              key={day._id || i}
              className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
              title={`${day._id}: ${day.count} contributions`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContributionSummary;