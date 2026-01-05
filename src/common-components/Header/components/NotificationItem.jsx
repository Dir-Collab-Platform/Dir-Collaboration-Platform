import React from 'react';
import { 
  MessageSquare, 
  Github, 
  AlertCircle, 
  X, 
  ExternalLink, 
  GitPullRequestArrow 
} from 'lucide-react';

function NotificationItem({ 
  notification, 
  expanded, 
  onClose, 
  onAction, 
  onToggleExpand,
  isPast = false 
}) {
  const { type } = notification;
  
  if (type === 'message') {
    return (
      <div 
        className={`rounded-lg p-3 mb-2 transition-all ${notification.read ? 'opacity-70' : ''}`}
        style={{
          backgroundColor: 'var(--dimmer-dark-bg)', 
          border: '1px solid var(--main-border-color)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'} 
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dimmer-dark-bg)'} 
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#673255' }}>
              <MessageSquare size={14} style={{ color: 'var(--primary-text-color)' }} />
            </div>
            <span className="font-medium" style={{ color: 'var(--primary-text-color)' }}>{notification.label}</span>
            <span className="text-xs ml-1" style={{ color: 'var(--secondary-text-color)' }}>{notification.time}</span>
          </div>
          <button 
            className="p-0.5 rounded hover:bg-gray-800"
            style={{ color: 'var(--secondary-text-color)' }}
            onClick={() => onClose(notification.id)}
          >
            <X size={12} />
          </button>
        </div>
        <h4 className="text-sm font-semibold mb-2 ml-8" style={{ color: 'var(--secondary-text-color)' }}>
          {notification.channel}
        </h4>
        
        <div className="flex gap-2.5 mb-3 ml-4">
          <div className="flex-shrink-0 ml-2">
            <img src={notification.userImg} alt={notification.userName} className="w-8 h-8 rounded-full" style={{ border: '1px solid rgba(239, 238, 238, 0.2)' }} />
          </div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>
              {expanded ? notification.fullMessage : notification.shortMessage}
            </p>
            {notification.hasMore && (
              <button 
                className="text-xs mt-1 hover:underline" 
                style={{ color: 'var(--secondary-text-color)' }}
                onClick={() => onToggleExpand(notification.id)}
              >
                {expanded ? 'see less' : 'more'}
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-center"> 
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors border hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--secondary-text-color)',
              borderColor: 'rgba(239, 238, 238, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.2)';
            }}
            onClick={() => onAction('Reply', notification.id)}
          >
            Reply
          </button>
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors border hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--secondary-text-color)',
              borderColor: 'rgba(239, 238, 238, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.2)';
            }}
            onClick={() => onAction('Mark as read', notification.id)}
          >
            Mark as read
          </button>
        </div>
      </div>
    );
  } else if (type === 'github') {
    return (
      <div 
        className={`rounded-lg p-3 mb-2 transition-all ${notification.read ? 'opacity-70' : ''}`}
        style={{
          backgroundColor: 'var(--dimmer-dark-bg)', 
          border: '1px solid var(--main-border-color)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dimmer-dark-bg)'} 
      >
        <div className="flex justify-between items-center mb-2 ">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: '#673255' }}>
              <Github size={14} style={{ color: 'var(--primary-text-color)' }} />
            </div>
            <span className="font-medium" style={{ color: 'var(--primary-text-color)' }}>{notification.label}</span>
            <ExternalLink size={12} className="ml-1" style={{ color: 'var(--secondary-text-color)', opacity: 0.6 }} />
            <span className="text-xs ml-1" style={{ color: 'var(--secondary-text-color)' }}>{notification.time}</span>
          </div>
          <button 
            className="p-0.5 rounded hover:bg-gray-800"
            style={{ color: 'var(--secondary-text-color)' }}
            onClick={() => onClose(notification.id)}
          >
            <X size={12} />
          </button>
        </div>
        <h4 className="text-sm font-semibold mb-2 ml-6" style={{ color: 'var(--secondary-text-color)' }}>
          {notification.repo}
        </h4>
        <div className="mb-3 ml-6">
          <div className="flex items-center gap-2 mb-2">
            <GitPullRequestArrow size={14} style={{ color: 'var(--secondary-text-color)' }} />
            <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>
              <strong style={{ color: 'var(--primary-text-color)' }}>{notification.user}</strong> created a pull request
            </p>
          </div>
          <div className="flex items-start gap-2 ">
            <div className="flex-1">
              <p className="text-xs" style={{ color: 'var(--mid-dim-font-color)' }}>
                {expanded ? notification.fullPR : notification.shortPR}
              </p>
              {notification.hasMore && (
                <button 
                  className="text-xs mt-1 hover:underline" 
                  style={{ color: 'var(--secondary-text-color)' }}
                  onClick={() => onToggleExpand(notification.id)}
                >
                  {expanded ? 'see less' : 'more'}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center"> 
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors border hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--secondary-text-color)',
              borderColor: 'rgba(239, 238, 238, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.2)';
            }}
            onClick={() => onAction('Review', notification.id)}
          >
            Review
          </button>
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors border hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--secondary-text-color)',
              borderColor: 'rgba(239, 238, 238, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.2)';
            }}
            onClick={() => onAction('Reject', notification.id)}
          >
            Reject
          </button>
        </div>
      </div>
    ); 
  } else if (type === 'alert') {
    return (
      <div 
        className={`rounded-lg p-3 mb-2 transition-all ${notification.read ? 'opacity-70' : ''}`}
        style={{
          backgroundColor: 'var(--dimmer-dark-bg)', 
          border: '1px solid main-border-color'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--card-bg)'} 
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--dimmer-dark-bg)'} 
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: 'var(--dark-bg)' }}>
              <Github size={14} style={{ color: 'var(--primary-text-color)' }} />
            </div>
            <span className="font-medium" style={{ color: 'var(--primary-text-color)' }}>{notification.label}</span>
            <AlertCircle size={16} style={{ color: '#ff4757' }} />
            <span className="text-xs ml-1" style={{ color: 'var(--secondary-text-color)' }}>{notification.time}</span>
          </div>
          <button 
            className="p-0.5 rounded hover:bg-gray-800"
            style={{ color: 'var(--secondary-text-color)' }}
            onClick={() => onClose(notification.id)}
          >
            <X size={12} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--secondary-text-color)' }}>{notification.repo}</h4>
          <ExternalLink size={12} style={{ color: 'var(--secondary-text-color)', opacity: 0.6 }} />
        </div>
        <div className="mb-3">
          <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>
            {expanded ? notification.fullAlert : notification.shortAlert}
          </p>
          {notification.hasMore && (
            <button 
              className="text-xs mt-1 hover:underline" 
              style={{ color: 'var(--secondary-text-color)' }}
              onClick={() => onToggleExpand(notification.id)}
            >
              {expanded ? 'see less' : 'more'}
            </button>
          )}
        </div>
        <div className="flex gap-2 justify-center">
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors border hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--secondary-text-color)',
              borderColor: 'rgba(239, 238, 238, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.2)';
            }}
            onClick={() => onAction('Checkout', notification.id)}
          >
            Checkout
          </button>
          <button 
            className="px-3 py-1.5 rounded text-xs font-medium transition-colors border hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--secondary-text-color)',
              borderColor: 'rgba(239, 238, 238, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button)';
              e.currentTarget.style.borderColor = 'rgba(239, 238, 238, 0.2)';
            }}
            onClick={() => onAction('Ignore', notification.id)}
          >
            Ignore
          </button>
        </div>
      </div>
    );
  }
}

export default NotificationItem;