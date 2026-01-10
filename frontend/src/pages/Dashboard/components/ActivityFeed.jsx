import React from 'react';
import { GitCommit, GitBranch, MessageSquare, GitPullRequest, AlertCircle, Workflow, Folder } from 'lucide-react';
import { getRelativeTime } from '../../../utils/utils';

const getIcon = (type) => {
  switch (type) {
    case 'commit': return { icon: GitCommit, color: 'text-yellow-500' };
    case 'branch': return { icon: GitBranch, color: 'text-blue-500' };
    case 'merge': return { icon: GitPullRequest, color: 'text-purple-500' };
    case 'issue': return { icon: AlertCircle, color: 'text-red-500' };
    case 'repository': return { icon: Folder, color: 'text-green-500' };
    case 'workspace': return { icon: Workflow, color: 'text-indigo-500' };
    default: return { icon: MessageSquare, color: 'text-gray-500' };
  }
};

const ActivityFeed = ({ activities = [] }) => {
  console.log('ActivityFeed rendered with:', activities);
  return (
    <div className="bg-(--bg-card) rounded-xl p-8 border border-white/5 h-fit shadow-sm">
      <h3 className="text-xl font-bold text-(--text-primary) mb-8">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((item, i) => {
          const { icon: Icon, color } = getIcon(item.iconType);
          return (
            <div key={item.id || i} className="flex items-start gap-4">
              <Icon size={18} className={`${color} mt-1 shrink-0`} />
              <div className="text-sm">
                <p className="text-(--text-dim)">
                  <span className="font-bold text-(--text-primary)">{item.user}</span> {item.action}
                  {item.targetName && <span className="text-indigo-400"> {item.targetName}</span>}
                </p>
                <p className="text-(--text-dim) italic text-xs mt-1">{item.message}</p>
                <p className="text-(--text-dim) text-[10px] mt-1">{item.timestamp ? getRelativeTime(item.timestamp) + ' ago' : ''}</p>
              </div>
            </div>
          );
        })}
        {activities.length === 0 && (
          <p className="text-(--text-dim) text-sm">No recent activity.</p>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;