import React from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import NotificationItem from './NotificationItem';

function NotificationPanel({ notifications, onClose, onMarkAllAsRead, onCloseNotification, onActionButton }) {

  return (
    <div
      className="absolute top-12 right-0 w-[90vw] sm:w-[480px] max-h-[80vh] rounded-2xl shadow-2xl z-(--z-popup) overflow-hidden flex flex-col border border-(--border-main) bg-(--bg-card)"
    >
      <div
        className="p-4 border-b flex justify-between items-center bg-(--bg-card) border-(--border-main)"
      >
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-(--text-secondary)" />
          <h3 className="font-bold text-sm text-(--text-secondary)">NOTIFICATIONS ({notifications.length})</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-(--button-primary) text-white hover:bg-(--button-primary-hover) transition-all active:scale-95"
            onClick={onMarkAllAsRead}
          >
            <span>Mark all read</span>
            <CheckCheck size={12} />
          </button>
          <button
            className="p-1.5 rounded-full text-(--text-secondary) hover:bg-(--bg-card-hover) hover:text-(--text-primary) transition-colors"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-h-[600px]">
        <div className="flex-1 overflow-y-auto p-2 scroll-bar bg-(--bg-card)">
          {notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClose={onCloseNotification}
              onAction={onActionButton}
            />
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-(--bg-dim) border border-(--border-main) text-(--text-secondary) opacity-50"
              >
                <Bell size={28} />
              </div>
              <h4 className="text-base font-bold mb-2 text-(--text-primary)">
                All caught up!
              </h4>
              <p className="text-sm text-(--text-secondary) max-w-[240px]">
                You have no new notifications at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;