import React from 'react';

const ContributionSummary = () => {
  const clusters = Array(6).fill(null);
  
  return (
    <div className="bg-[#1D1D29] rounded-xl p-8 border border-white/5">
      <h3 className="text-xl font-bold text-white mb-8">Contributions</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {clusters.map((_, i) => (
          <div key={i} className="grid grid-rows-5 grid-flow-col gap-1.5">
            {Array(20).fill(null).map((_, j) => {
              const isActive = Math.random() > 0.4;
              return (
                <div 
                  key={j} 
                  className={`w-4 h-4 rounded-sm ${isActive ? 'bg-green-500' : 'bg-gray-800'}`} 
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributionSummary;