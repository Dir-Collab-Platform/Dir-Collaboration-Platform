import React from 'react';
import { GitCommit, GitBranch, MessageSquare } from 'lucide-react';

const ActivityFeed = ({ activities = [] }) => {
  const mockActivities = [
    { user: 'Jane Doe', action: 'committed to/webapp', msg: '"fix: update button styles"', icon: GitCommit, color: 'text-green-500' },
    { user: 'Jane Doe', action: 'created new branch', msg: '"temp"', icon: GitBranch, color: 'text-blue-500' },
    { user: 'Jane Doe', action: 'committed to/webapp', msg: '"fix: update button styles"', icon: MessageSquare, color: 'text-yellow-500' },
    { user: 'Jane Doe', action: 'committed to/webapp', msg: '"fix: update button styles"', icon: GitCommit, color: 'text-green-500' },
  ];

  return (
    <div className="bg-[#1D1D29] rounded-xl p-8 border border-white/5 h-full">
      <h3 className="text-xl font-bold text-white mb-8">Recent Activity</h3>
      <div className="space-y-6">
        {mockActivities.map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <item.icon size={18} className={`${item.color} mt-1`} />
            <div className="text-sm">
              <p className="text-gray-300">
                <span className="font-bold text-white">{item.user}</span> {item.action}: <span className="text-gray-500 italic">{item.msg}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;