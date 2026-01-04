import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Bell,
  MessageSquare,
  Github,
  AlertCircle,
  Plus,
  Menu,
  X,
  ExternalLink,
  GitBranchPlus,
  CheckCheck,
  LogOut,
  LayoutDashboard,
  GitPullRequestArrow,
  Search,
  Folder,
  Briefcase,
  Settings
} from 'lucide-react';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCreateRepoOpen, setIsCreateRepoOpen] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [readme, setReadme] = useState('no');
  const [gitignore, setGitignore] = useState('no');
  
  // State for toggling full messages in notifications
  const [expandedMessages, setExpandedMessages] = useState({});
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      label: 'Message',
      time: '2hrs ago',
      channel: '#Front-end team',
      userImg: '/assets/images/person.jpg',
      userName: 'Efrata',
      shortMessage: 'Efrata: Have you finished designing...',
      fullMessage: 'Efrata: Have you finished designing the header component for the repository page? We need it by tomorrow for the upcoming sprint review. Could you also add the dark mode toggle functionality?',
      hasMore: true
    },
    {
      id: 2,
      type: 'github',
      label: 'GitHub',
      time: '2hrs ago',
      repo: 'My-repository',
      user: 'Abrsh123',
      shortPR: 'I implemented the file browsing features...',
      fullPR: 'I implemented the file browsing features with drag-and-drop support and improved the UI for better user experience. Added file type icons, keyboard shortcuts, and bulk selection capabilities. Also optimized the performance for handling large repositories.',
      hasMore: true
    },
    {
      id: 3,
      type: 'alert',
      label: 'Alert',
      time: '2hrs ago',
      repo: 'My-repository',
      shortAlert: 'Someone logged in with your GitHub account on device...',
      fullAlert: 'Someone logged in with your GitHub account from a new device in London, UK. If this wasn\'t you, please secure your account immediately. Check your account activity and consider changing your password and enabling two-factor authentication.',
      hasMore: true
    }
  ]);
  
  const [pastNotifications, setPastNotifications] = useState([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);

  const notificationPanelRef = useRef(null);
  const bellBtnRef = useRef(null);

  // ===== CREATE REPOSITORY MODAL =====
  const handleNewRepoClick = () => {
    setIsCreateRepoOpen(true);
  };

  const handleCloseCreateRepo = () => {
    setIsCreateRepoOpen(false);
    setRepoName('');
    setDescription('');
    setVisibility('private');
    setReadme('no');
    setGitignore('no');
  };

  const handleCreateRepository = (e) => {
    if (e) e.preventDefault();
    
    if (!repoName.trim()) {
      alert("Please enter a repository name");
      return;
    }
    
    console.log('Creating repository:', {
      name: repoName,
      description,
      visibility,
      readme,
      gitignore
    });
    
    alert(`Repository "${repoName}" created successfully!`);
    
    handleCloseCreateRepo();
  };

  const handleOptionChange = (optionType, value) => {
    switch (optionType) {
      case 'visibility':
        setVisibility(value);
        break;
      case 'readme':
        setReadme(value);
        break;
      case 'gitignore':
        setGitignore(value);
        break;
      default:
    }
  };

  // ===== MENU NAVIGATION =====
  const handleMenuItemClick = (itemName) => {
    const routeMap = {
      'Dashboard': '/',
      'Repositories': '/repositories',
      'Workspaces': '/workspaces'
    };
    
    const route = routeMap[itemName];
    if (route) {
      navigate(route);
    }
    
    setIsMenuOpen(false);
  };

  // ===== NOTIFICATION PANEL =====
  const toggleNotificationPanel = (e) => {
    if (e) e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  const closeNotificationPanel = () => {
    setIsNotificationOpen(false);
  };

  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
  };

  const handleCloseNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleLoadPastNotifications = () => {
    setIsLoadingPast(true);
    
    setTimeout(() => {
      const newPastNotifications = [
        {
          id: Date.now() + 1,
          type: 'message',
          label: 'Message',
          time: 'Yesterday',
          channel: '#Design-team',
          userImg: '/assets/images/person.jpg',
          userName: 'Sarah',
          shortMessage: 'Sarah: Can you review the new UI mockups...',
          fullMessage: 'Sarah: Can you review the new UI mockups for the dashboard? I\'ve uploaded them to Figma. Let me know if you have any feedback on the color scheme and layout.',
          hasMore: true,
          past: true
        },
        {
          id: Date.now() + 2,
          type: 'github',
          label: 'GitHub',
          time: '1 day ago',
          repo: 'Design-system',
          user: 'DesignLead',
          shortPR: 'Added new color variables and typography...',
          fullPR: 'Added new color variables and typography scale to the design system. This includes new tokens for spacing, shadows, and component-specific styling improvements.',
          hasMore: true,
          past: true
        }
      ];
      
      setPastNotifications(prev => [...newPastNotifications, ...prev]);
      setIsLoadingPast(false);
    }, 1200);
  };

  const handleActionButton = (action, notificationId) => {
    switch(action.toLowerCase()) {
      case 'reply':
        break;
      case 'mark as read':
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        break;
      case 'review':
        break;
      case 'reject':
        handleCloseNotification(notificationId);
        break;
      case 'checkout':
        break;
      case 'ignore':
        handleCloseNotification(notificationId);
        break;
      default:
    }
  };

  const toggleMessageExpansion = (notificationId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [notificationId]: !prev[notificationId]
    }));
  };

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationPanelRef.current && 
        !notificationPanelRef.current.contains(event.target) &&
        bellBtnRef.current && 
        !bellBtnRef.current.contains(event.target)
      ) {
        closeNotificationPanel();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (isNotificationOpen) {
          closeNotificationPanel();
        }
        if (isCreateRepoOpen) {
          handleCloseCreateRepo();
        }
      }
    };

    if (isNotificationOpen || isCreateRepoOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isNotificationOpen, isCreateRepoOpen]);

  const renderNotificationItem = (notification, isPast = false) => {
    const isExpanded = expandedMessages[notification.id] || false;
    
    if (notification.type === 'message') {
      return (
        <div 
          key={notification.id} 
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
              onClick={() => handleCloseNotification(notification.id)}
            >
              <X size={12} />
            </button>
          </div>
          <h4 className="text-sm font-semibold mb-2 ml-8" style={{ color: 'var(--secondary-text-color)' }}>
            {notification.channel}
          </h4>
          
          <div className="flex gap-2.5 mb-3 ml-4">
            <div className="flex-shrink-0 ml-2">
              <img src={notification.userImg} alt={notification.userName} className="w-6 h-6 rounded-full" style={{ border: '1px solid rgba(239, 238, 238, 0.2)' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>
                {isExpanded ? notification.fullMessage : notification.shortMessage}
              </p>
              {notification.hasMore && (
                <button 
                  className="text-xs mt-1 hover:underline" 
                  style={{ color: 'var(--secondary-text-color)' }}
                  onClick={() => toggleMessageExpansion(notification.id)}
                >
                  {isExpanded ? 'see less' : 'more'}
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
              onClick={() => handleActionButton('Reply', notification.id)}
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
              onClick={() => handleActionButton('Mark as read', notification.id)}
            >
              Mark as read
            </button>
          </div>
        </div>
      );
    } else if (notification.type === 'github') {
      return (
        <div 
          key={notification.id} 
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
              onClick={() => handleCloseNotification(notification.id)}
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
                  {isExpanded ? notification.fullPR : notification.shortPR}
                </p>
                {notification.hasMore && (
                  <button 
                    className="text-xs mt-1 hover:underline" 
                    style={{ color: 'var(--secondary-text-color)' }}
                    onClick={() => toggleMessageExpansion(notification.id)}
                  >
                    {isExpanded ? 'see less' : 'more'}
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
              onClick={() => handleActionButton('Review', notification.id)}
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
              onClick={() => handleActionButton('Reject', notification.id)}
            >
              Reject
            </button>
          </div>
        </div>
      ); 
    } else if (notification.type === 'alert') {
      return (
        <div 
          key={notification.id} 
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
              onClick={() => handleCloseNotification(notification.id)}
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
              {isExpanded ? notification.fullAlert : notification.shortAlert}
            </p>
            {notification.hasMore && (
              <button 
                className="text-xs mt-1 hover:underline" 
                style={{ color: 'var(--secondary-text-color)' }}
                onClick={() => toggleMessageExpansion(notification.id)}
              >
                {isExpanded ? 'see less' : 'more'}
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
              onClick={() => handleActionButton('Checkout', notification.id)}
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
              onClick={() => handleActionButton('Ignore', notification.id)}
            >
              Ignore
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav 
        className="p-4 fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'var(--dark-bg)',
          borderBottom: '1px solid var(--main-border-color)'
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="/assets/images/Dir logo.png" 
                alt="logo" 
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Right: Button + Bell + Hamburger */}
          <div className="flex items-center gap-6">
            {/* New Repository Button */}
            <button
              onClick={handleNewRepoClick}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--primary-button)',
                color: 'var(--primary-text-color)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button)'}
            >
              <Plus size={16} />
              <span>New Repository</span>
            </button>

            {/* Bell Icon with Notification Panel */}
            <div className="relative">
              <button
                ref={bellBtnRef}
                onClick={toggleNotificationPanel}
                className="p-2 rounded-md transition-colors relative"
                style={{ color: 'var(--secondary-text-color)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
                  e.currentTarget.style.color = 'var(--primary-text-color)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--secondary-text-color)';
                }}
              >
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--notification-count-bg)' }}
                  >
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {isNotificationOpen && (
                <div 
                  ref={notificationPanelRef}
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
                        onClick={handleMarkAllAsRead}
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
                        onClick={closeNotificationPanel}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable notifications */}
                  <div className="flex-1 flex flex-col max-h-[432px]"> {/* 500px - 68px header */}
                    <div className="flex-1 overflow-y-auto p-2">
                      {notifications.map(notification => renderNotificationItem(notification))}
                      {pastNotifications.map(notification => renderNotificationItem(notification, true))}
                      
                      {/* Show empty state if no notifications */}
                      {notifications.length === 0 && pastNotifications.length === 0 && (
                        <div className="text-center py-8">
                          <p style={{ color: 'var(--secondary-text-color)' }}>No notifications</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Load past button */}
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
                        onClick={handleLoadPastNotifications}
                        disabled={isLoadingPast}
                      >
                        {isLoadingPast ? 'Loading...' : 'Load past notifications'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md transition-colors"
              style={{ color: 'var(--secondary-text-color)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
                e.currentTarget.style.color = 'var(--primary-text-color)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--secondary-text-color)';
              }}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div 
        className={`fixed top-0 right-0 w-80 h-screen z-50 transition-transform duration-300 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          backgroundColor: 'var(--dark-bg)',
          borderLeft: '1px solid rgba(239, 238, 238, 0.28)'
        }}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-md"
          style={{ color: 'var(--secondary-text-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
            e.currentTarget.style.color = 'var(--primary-text-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--secondary-text-color)';
          }}
        >
          <X size={20} />
        </button>

        {/* User Profile */}
        <div 
          className="flex items-center gap-4 mt-16 mb-8 px-4 py-3 rounded-lg mx-4"
          style={{ backgroundColor: 'var(--card-bg)' }}
        >
          <img src="/assets/images/person.jpg" alt="person" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <p className="font-semibold" style={{ color: 'var(--primary-text-color)' }}>Efrata</p>
            <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>@zeamanuel</p>
          </div>
        </div>

        <hr className="my-4 mx-4" style={{ borderColor: 'rgba(239, 238, 238, 0.2)' }} />

        {/* Menu Items */}
        <div className="px-4 space-y-1">
          <button 
            onClick={() => handleMenuItemClick('Dashboard')}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
            style={{ color: 'var(--secondary-text-color)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.color = 'var(--primary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
            }}
          >
            <LayoutDashboard size={20} style={{ color: 'var(--secondary-text-color)' }} />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => navigate('/repositories')}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
            style={{ color: 'var(--secondary-text-color)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.color = 'var(--primary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
            }}
          >
            <Folder size={20} style={{ color: 'var(--secondary-text-color)' }} />
            <span>Repositories</span>
          </button>

          <button 
            onClick={() => navigate('/workspaces')}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
            style={{ color: 'var(--secondary-text-color)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.color = 'var(--primary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
            }}
          >
            <Briefcase size={20} style={{ color: 'var(--secondary-text-color)' }} />
            <span>Workspaces</span>
          </button>

          <button 
            onClick={() => {
              setIsMenuOpen(false);
              
            }}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
            style={{ color: 'var(--secondary-text-color)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.color = 'var(--primary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
            }}
          >
            <Settings size={20} style={{ color: 'var(--secondary-text-color)' }} />
            <span>Settings</span>
          </button>

          <button 
            onClick={() => handleMenuItemClick('Explore')}
            className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
            style={{ color: 'var(--secondary-text-color)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
              e.currentTarget.style.color = 'var(--primary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--secondary-text-color)';
              e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
            }}
          >
            <Search size={20} style={{ color: 'var(--secondary-text-color)' }} />
            <span>Explore</span>
          </button>
        </div>

        <hr className="my-4 mx-4" style={{ borderColor: 'rgba(239, 238, 238, 0.2)' }} />

        {/* Logout */}
        <button 
          onClick={() => {
            const confirmLogout = window.confirm('Are you sure you want to log out?');
            if (confirmLogout) {
              // Handle logout logic here
            }
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors mx-4"
          style={{ color: '#ff4757' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={20} style={{ color: '#ff4757' }} />
          <span>Log out</span>
        </button>
      </div>

      {/* Create Repository Modal */}
      {isCreateRepoOpen && (
        <div 
          className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={handleCloseCreateRepo}
        >
          <div 
            className="rounded-xl w-full max-w-md overflow-hidden"
            style={{
              backgroundColor: 'var(--dark-bg)',
              border: '1px solid var(--main-border-color)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: 'var(--main-border-color)' }}
            >
              {/* Empty div to balance the space on left */}
              <div className="w-6"></div>
              
              {/* Centered title */}
              <h2 className="text-lg font-semibold flex-1 text-center" style={{ color: 'var(--primary-text-color)' }}>
                Create New Repository
              </h2>
              
              {/* Close button on right */}
              <button 
                className="p-1 rounded w-6 flex items-center justify-center"
                style={{ color: 'var(--secondary-text-color)' }}
                onClick={handleCloseCreateRepo}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleCreateRepository}>
                {/* Repository Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary-text-color)' }}>
                    Repository name
                  </label>
                  <input 
                    type="text" 
                    placeholder="my-repository" 
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--active-text-color)] focus:border-transparent"
                    style={{
                      backgroundColor: '#303036',
                      border: '1px solid var(--main-border-color)'
                    }}
                  />
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--primary-text-color)' }}>
                    Description
                  </label>
                  <input 
                    type="text" 
                    placeholder="A brief description of your repository..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--active-text-color)] focus:border-transparent"
                    style={{
                      backgroundColor: '#303036',
                      border: '1px solid var(--main-border-color)'
                    }}
                  />
                </div>
                
                {/* Options Container */}
                <div className="space-y-6 mb-8">
                  {/* Visibility */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: 'var(--primary-text-color)' }}>
                      Visibility
                    </label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${visibility === 'public' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{
                          backgroundColor: visibility === 'public' ? 'var(--secondary-button-hover)' : 'var(--secondary-button)'
                        }}
                        onClick={() => handleOptionChange('visibility', 'public')}
                      >
                        Public
                      </button>
                      <button 
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${visibility === 'private' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{
                          backgroundColor: visibility === 'private' ? 'var(--secondary-button-hover)' : 'var(--secondary-button)'
                        }}
                        onClick={() => handleOptionChange('visibility', 'private')}
                      >
                        Private
                      </button>
                    </div>
                  </div>
                  
                  {/* README */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: 'var(--primary-text-color)' }}>
                      Add README
                    </label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${readme === 'yes' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{
                          backgroundColor: readme === 'yes' ? 'var(--secondary-button-hover)' : 'var(--secondary-button)'
                        }}
                        onClick={() => handleOptionChange('readme', 'yes')}
                      >
                        Yes
                      </button>
                      <button 
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${readme === 'no' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{
                          backgroundColor: readme === 'no' ? 'var(--secondary-button-hover)' : 'var(--secondary-button)'
                        }}
                        onClick={() => handleOptionChange('readme', 'no')}
                      >
                        No
                      </button>
                    </div>
                  </div>
                  
                  {/* .gitignore */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" style={{ color: 'var(--primary-text-color)' }}>
                      Add .gitignore
                    </label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${gitignore === 'yes' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{
                          backgroundColor: gitignore === 'yes' ? 'var(--secondary-button-hover)' : 'var(--secondary-button)'
                        }}
                        onClick={() => handleOptionChange('gitignore', 'yes')}
                      >
                        Yes
                      </button>
                      <button 
                        type="button"
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${gitignore === 'no' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                        style={{
                          backgroundColor: gitignore === 'no' ? 'var(--secondary-button-hover)' : 'var(--secondary-button)'
                        }}
                        onClick={() => handleOptionChange('gitignore', 'no')}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div>
                  <button 
                    type="submit" 
                    className="w-full py-3 rounded-lg font-semibold transition-colors hover:-translate-y-0.5"
                    style={{
                      backgroundColor: 'var(--primary-button)',
                      color: 'var(--primary-text-color)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button)'}
                  >
                    Create Repository
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="pt-16"></div>
    </>
  );
}

export default Header;