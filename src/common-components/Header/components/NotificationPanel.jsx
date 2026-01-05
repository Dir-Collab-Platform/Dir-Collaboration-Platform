import React from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import NotificationItem from './NotificationItem';

function NotificationPanel({ 
  notifications,
  pastNotifications,
  expandedMessages,
  isLoadingPast,
  onClose,
  onMarkAllAsRead,
  onCloseNotification,
  onActionButton,
  onToggleMessageExpansion,
  onLoadPastNotifications
}) {
  return (
    <div 
      className="absolute top-12 right-0 w-96 max-h-[500px] rounded-lg shadow-xl z-50 overflow-hidden flex flex-col"
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

      <div className="flex-1 flex flex-col max-h-[432px]">
        <div className="flex-1 overflow-y-auto p-2">
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              expanded={expandedMessages[notification.id] || false}
              onClose={onCloseNotification}
              onAction={onActionButton}
              onToggleExpand={onToggleMessageExpansion}
            />
          ))}
          {pastNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              expanded={expandedMessages[notification.id] || false}
              onClose={onCloseNotification}
              onAction={onActionButton}
              onToggleExpand={onToggleMessageExpansion}
              isPast={true}
            />
          ))}
          
          {notifications.length === 0 && pastNotifications.length === 0 && (
            <div className="text-center py-8">
              <p style={{ color: 'var(--secondary-text-color)' }}>No notifications</p>
            </div>
          )}
        </div>
        
        <div 
          className="p-4 border-t flex justify-end shrink-0"
          style={{ 
            backgroundColor: 'var(--dark-bg)',
            borderColor: 'rgba(220, 219, 219, 0.2)'
          }}
        >
          <button 
            className="px-6 py-2.5 rounded-md text-sm font-medium transition-colors hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: 'var(--primary-button)',
              color: 'var(--primary-text-color)'
            }}
            onMouseEnter={(e) => {
              if (!isLoadingPast) {
                e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoadingPast) {
                e.currentTarget.style.backgroundColor = 'var(--primary-button)';
              }
            }}
            onClick={onLoadPastNotifications}
            disabled={isLoadingPast}
          >
            {isLoadingPast ? 'Loading...' : 'Load past notifications'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationPanel;