import React from 'react';
import {
  GitCommit,
  GitBranch,
  MessageSquare,
  GitPullRequest,
  AlertCircle,
  Workflow,
  Folder,
  MessageCircle,
  Tag,
  User,
  FileCode,
  Bell,
  Hash
} from 'lucide-react';
import { getRelativeTime } from '../../../utils/utils';

const getIcon = (type) => {
  switch (type) {
    case 'repository': return { icon: Folder, color: 'var(--code-function)' };
    case 'pull_request': return { icon: GitPullRequest, color: 'var(--text-active)' };
    case 'issue': return { icon: AlertCircle, color: 'var(--notif-bg)' };
    case 'message': return { icon: MessageSquare, color: 'var(--text-active)' };
    case 'comment': return { icon: MessageCircle, color: 'var(--text-secondary)' };
    case 'tag': return { icon: Tag, color: 'var(--mid-dim-font-color)' };
    case 'user': return { icon: User, color: 'var(--text-primary)' };
    case 'workspace': return { icon: Workflow, color: 'var(--text-active)' };
    case 'file': return { icon: FileCode, color: 'var(--code-string)' };
    case 'notification': return { icon: Bell, color: 'var(--notif-bg)' };
    case 'channel': return { icon: Hash, color: 'var(--channel-hash-color)' };
    // Fallbacks
    case 'commit': return { icon: GitCommit, color: '#EAB308' }; // yellow-500
    case 'branch': return { icon: GitBranch, color: '#3B82F6' }; // blue-500
    default: return { icon: MessageSquare, color: 'var(--text-secondary)' };
  }
};

const ActivityFeed = ({ activities = [] }) => {
  // console.log('ActivityFeed rendered with:', activities);
  return (
    <div className="bg-(--bg-card) rounded-xl p-8 border border-white/5 h-fit shadow-sm">
      <h3 className="text-xl font-bold text-(--text-primary) mb-8">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((item, i) => {
          const { icon: Icon, color } = getIcon(item.iconType);
          return (
            <div key={item.id || i} className="flex items-start gap-4">
              <Icon
                size={18}
                style={{ color: color }}
                className="mt-1 shrink-0"
              />
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