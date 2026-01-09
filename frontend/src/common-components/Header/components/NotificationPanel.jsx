import React from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import NotificationItem from './NotificationItem';

function NotificationPanel({ notifications, onClose, onMarkAllAsRead, onCloseNotification, onActionButton }) {
  
  return (
    <div
      className="absolute top-12 right-0 w-[480px] max-h-[800px] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--dark-bg)',
        border: '1px solid rgba(239, 238, 238, 0.2)'
      }}
    >
      <div
        className="p-4 border-b flex justify-between items-center"
        style={{
          backgroundColor: 'var(--dark-bg)',
          borderColor: 'rgba(239, 238, 238, 0.2)'
        }}
      >
        <div className="flex items-center gap-2">
          <Bell size={20} style={{ color: 'var(--secondary-text-color)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--secondary-text-color)' }}>Notifications ({notifications.length})</h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded text-xs transition-colors"
            style={{
              backgroundColor: 'var(--primary-button)',
              color: 'var(--primary-text-color)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button)'}
            onClick={onMarkAllAsRead}
          >
            <span>Mark all as read</span>
            <CheckCheck size={12} />
          </button>
          <button
            className="p-1 rounded"
            style={{ color: 'var(--secondary-text-color)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.color = 'var(--primary-text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text-color)';
            }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-h-[650px]">
        <div className="flex-1 overflow-y-auto p-2 scroll-bar">
          {notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClose={onCloseNotification}
              onAction={onActionButton}
            />
          ))}

          {notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110"
                style={{ backgroundColor: 'rgba(239, 238, 238, 0.05)', border: '1px solid rgba(239, 238, 238, 0.1)' }}
              >
                <Bell size={24} style={{ color: 'var(--secondary-text-color)', opacity: 0.5 }} />
              </div>
              <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--primary-text-color)' }}>
                All caught up!
              </h4>
              <p className="text-xs max-w-[200px]" style={{ color: 'var(--secondary-text-color)', opacity: 0.7 }}>
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