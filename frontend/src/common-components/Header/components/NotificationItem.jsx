import React from 'react';
import { MessageSquare, AlertCircle, X, ExternalLink, GitPullRequestArrow, Bell } from 'lucide-react';
import { GithubIcon } from '../../../../public/assets/icons/icons';
import { getRelativeTime } from '../../../utils/utils';

const TYPE_CONFIG = {
  message: {
    icon: MessageSquare,
    color: '#673255',
    label: 'Message',
  },
  github: {
    icon: GithubIcon,
    color: '#2b3137',
    label: 'GitHub',
  },
  alert: {
    icon: AlertCircle,
    color: '#ff4757',
    label: 'Alert',
  },
  default: {
    icon: Bell,
    color: 'var(--secondary-button)',
    label: 'Notification',
  }
};

function NotificationItem({ notification, onClose, onAction, isPast = false }) {
  const { _id, message, isRead, type, createdAt } = notification;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.default;
  const Icon = config.icon;

  const timeLabel = getRelativeTime(createdAt);

  return (
    <div
      className={`group relative rounded-xl p-4 mb-3 transition-all border border-(--main-border-color) 
        ${isRead ? 'opacity-60 grayscale-[0.2]' : 'bg-(--dimmer-dark-bg) hover:bg-(--card-bg-lighter) shadow-sm'}`}
    >
      <div className="flex gap-3">
        {/* Icon & Status */}
        <div className="flex-shrink-0 mt-1">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shadow-inner"
            style={{ backgroundColor: config.color }}
          >
            <Icon size={16} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-(--secondary-text-color)">
                {config.label}
              </span>
              <span className="w-1 h-1 rounded-full bg-(--main-border-color)" />
              <span className="text-xs text-(--secondary-text-color)">
                {timeLabel}
              </span>
            </div>

            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-all"
              style={{ color: 'var(--secondary-text-color)' }}
              onClick={(e) => {
                e.stopPropagation();
                onClose(_id);
              }}
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-(--primary-text-color) mb-3">
            {message}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            {!isRead && (
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-(--primary-button) text-(--primary-text-color) hover:brightness-110 transition-all active:scale-95"
                onClick={() => onAction('Mark as read', _id)}
              >
                Mark as Read
              </button>
            )}
            <button
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-(--secondary-button) text-(--secondary-text-color) border border-(--main-border-color) hover:bg-(--secondary-button-hover) transition-all active:scale-95"
              onClick={() => onAction('View', _id)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Unread Indicator */}
      {!isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      )}
    </div>
  );
}

export default NotificationItem;