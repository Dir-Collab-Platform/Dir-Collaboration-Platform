import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
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
  Search,
  Folder,
  Briefcase,
  Settings
} from 'lucide-react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      label: 'Message',
      time: '2hrs ago',
      channel: '#Front-end team',
      userImg: '/assets/images/person.jpg',
      userName: 'Efrata',
      message: 'Have you finished designing the header component for the repository page? We need it by tomorrow...',
      hasMore: true
    },
    {
      id: 2,
      type: 'github',
      label: 'GitHub',
      time: '2hrs ago',
      repo: 'My-repository',
      user: 'Abrsh123',
      prDescription: 'I implemented the file browsing features with drag-and-drop support and improved the UI...',
      hasMore: true
    },
    {
      id: 3,
      type: 'alert',
      label: 'Alert',
      time: '2hrs ago',
      repo: 'My-repository',
      message: 'Someone logged in with your GitHub account from a new device in London, UK. If this wasn\'t you, please secure your account...',
      hasMore: true
    }
  ]);
  const [pastNotifications, setPastNotifications] = useState([]);
  const [isLoadingPast, setIsLoadingPast] = useState(false);

  const notificationPanelRef = useRef(null);
  const bellBtnRef = useRef(null);

  // Handle New Repository button click
  const handleNewRepoClick = () => {
    const createRepo = window.confirm('Create a new repository?');
    if (createRepo) {
      alert('Redirecting to repository creation...');
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (itemName) => {
    alert(`Navigating to ${itemName}...`);
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      alert('Logging out...');
    }
  };

  // Toggle notification panel
  const toggleNotificationPanel = (e) => {
    if (e) e.stopPropagation();
    setIsNotificationOpen(!isNotificationOpen);
  };

  // Close notification panel
  const closeNotificationPanel = () => {
    setIsNotificationOpen(false);
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    
    // Show success message
    alert('All notifications marked as read');
    
    // Close panel after delay
    setTimeout(() => {
      closeNotificationPanel();
    }, 800);
  };

  // Close single notification
  const handleCloseNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Load past notifications
  const handleLoadPastNotifications = () => {
    setIsLoadingPast(true);
    
    // Simulate API call
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
          message: 'Can you review the new UI mockups for the dashboard? I\'ve uploaded them to Figma...',
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
          prDescription: 'Added new color variables and typography scale to the design system...',
          hasMore: true,
          past: true
        }
      ];
      
      setPastNotifications(prev => [...newPastNotifications, ...prev]);
      setIsLoadingPast(false);
      alert(`Loaded ${newPastNotifications.length} past notifications`);
    }, 1200);
  };

  // Handle action button clicks
  const handleActionButton = (action, notificationId) => {
    switch(action.toLowerCase()) {
      case 'reply':
        alert('Opening reply dialog...');
        break;
      case 'mark as read':
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        alert('Notification marked as read');
        break;
      case 'review':
        alert('Opening pull request review...');
        break;
      case 'reject':
        if (window.confirm('Are you sure you want to reject this pull request?')) {
          handleCloseNotification(notificationId);
          alert('Pull request rejected');
        }
        break;
      case 'checkout':
        alert('Checking security alert details...');
        break;
      case 'ignore':
        if (window.confirm('Ignore this security alert? This action cannot be undone.')) {
          handleCloseNotification(notificationId);
          alert('Alert ignored');
        }
        break;
      default:
        alert(`${action} action performed`);
    }
  };

  // Close notification panel when clicking outside
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

    // Close with Escape key
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isNotificationOpen) {
        closeNotificationPanel();
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isNotificationOpen]);

  // Render notification item based on type
  const renderNotificationItem = (notification, isPast = false) => {
    if (notification.type === 'message') {
      return (
        <div className={`notification-item ${notification.read ? 'read' : ''}`} key={notification.id}>
          <div className="notification-header-row">
            <div className="notification-type">
              <MessageSquare size={16} className="notification-icon" />
              <span className="notification-label">{notification.label}</span>
              <span className="notification-time">{notification.time}</span>
            </div>
            <button 
              className="close-notification-btn"
              onClick={() => handleCloseNotification(notification.id)}
            >
              <X size={12} />
            </button>
          </div>
          <h4 className="notification-channel">{notification.channel}</h4>
          <div className="notification-content">
            <div className="user-avatar">
              <img src={notification.userImg} alt={notification.userName} />
            </div>
            <div className="message-preview">
              <p><strong>{notification.userName}:</strong> {notification.message}</p>
              {notification.hasMore && <button className="view-more-btn">more</button>}
            </div>
          </div>
          <div className="notification-actions-row">
            <button 
              className="action-btn reply-btn"
              onClick={() => handleActionButton('Reply', notification.id)}
            >
              Reply
            </button>
            <button 
              className="action-btn mark-read-btn"
              onClick={() => handleActionButton('Mark as read', notification.id)}
            >
              Mark as read
            </button>
          </div>
        </div>
      );
    } else if (notification.type === 'github') {
      return (
        <div className={`notification-item ${notification.read ? 'read' : ''}`} key={notification.id}>
          <div className="notification-header-row">
            <div className="notification-type">
              <Github size={16} className="notification-icon" />
              <span className="notification-label">{notification.label}</span>
              <ExternalLink size={12} className="external-link" />
              <span className="notification-time">{notification.time}</span>
            </div>
            <button 
              className="close-notification-btn"
              onClick={() => handleCloseNotification(notification.id)}
            >
              <X size={12} />
            </button>
          </div>
          <h4 className="notification-repo">{notification.repo}</h4>
          <div className="notification-content">
            <div className="github-icon">
              <GitBranchPlus size={32} />
            </div>
            <div className="pr-details">
              <p><strong>{notification.user}</strong> created a pull request</p>
              <p className="pr-description">{notification.prDescription}</p>
              {notification.hasMore && <button className="view-more-btn">more</button>}
            </div>
          </div>
          <div className="notification-actions-row">
            <button 
              className="action-btn review-btn"
              onClick={() => handleActionButton('Review', notification.id)}
            >
              Review
            </button>
            <button 
              className="action-btn reject-btn"
              onClick={() => handleActionButton('Reject', notification.id)}
            >
              Reject
            </button>
          </div>
        </div>
      );
    } else if (notification.type === 'alert') {
      return (
        <div className={`notification-item ${notification.read ? 'read' : ''}`} key={notification.id}>
          <div className="notification-header-row">
            <div className="notification-type">
              <span className="notification-label">{notification.label}</span>
              <AlertCircle size={16} className="notification-icon" />
              <span className="notification-time">{notification.time}</span>
            </div>
            <button 
              className="close-notification-btn"
              onClick={() => handleCloseNotification(notification.id)}
            >
              <X size={12} />
            </button>
          </div>
          <div className="alert-repo">
            <Github size={16} />
            <h4>{notification.repo}</h4>
            <ExternalLink size={12} className="external-link" />
          </div>
          <div className="notification-content">
            <div className="alert-message">
              <p>{notification.message}</p>
              {notification.hasMore && <button className="view-more-btn">more</button>}
            </div>
          </div>
          <div className="notification-actions-row">
            <button 
              className="action-btn checkout-btn"
              onClick={() => handleActionButton('Checkout', notification.id)}
            >
              Checkout
            </button>
            <button 
              className="action-btn ignore-btn"
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
      <nav className="nav">
        <div className="nav-container">
          {/* Left: Logo */}
          <div className="left-section">
            <div className="logo-div">
              <img 
                src="/assets/images/Dir logo.png" 
                alt="logo" 
              />
            </div>
          </div>

          {/* Right: Button + Bell + Hamburger */}
          <div className="right-section">
            {/* New Repository Button */}
            <button
              onClick={handleNewRepoClick}
              className="new-repo-btn"
            >
              <Plus size={16} />
              <span>New Repository</span>
            </button>

            {/* Bell Icon with Notification Panel */}
            <div className="bell-container">
              <button
                ref={bellBtnRef}
                onClick={toggleNotificationPanel}
                className="bell-btn"
              >
                <Bell size={24} />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
              </button>

              {/* Notification Panel */}
              <div 
                ref={notificationPanelRef}
                className={`notification-panel ${isNotificationOpen ? 'active' : ''}`}
              >
                <div className="notification-header">
                  <div className="notification-title">
                    <Bell size={20} />
                    <h3>Notifications ({notifications.length})</h3>
                  </div>
                  <div className="notification-actions">
                    <button 
                      className="mark-all-btn"
                      onClick={handleMarkAllAsRead}
                    >
                      <span>Mark all as read</span>
                      <CheckCheck size={12} />
                    </button>
                    <button 
                      className="close-panel-btn"
                      onClick={closeNotificationPanel}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="notifications-list">
                  {/* Current Notifications */}
                  {notifications.map(notification => renderNotificationItem(notification))}
                  
                  {/* Past Notifications */}
                  {pastNotifications.map(notification => renderNotificationItem(notification, true))}
                </div>

                <div className="notification-footer">
                  <button 
                    className="load-past-btn"
                    onClick={handleLoadPastNotifications}
                    disabled={isLoadingPast}
                  >
                    {isLoadingPast ? 'Loading...' : 'Load past notifications'}
                  </button>
                </div>
              </div>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="hamburger"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>
        <button
          onClick={() => setIsMenuOpen(false)}
          className="close-btn"
        >
          <X size={20} />
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <img src="/assets/images/person.jpg" alt="person" className="profile-pic" />
          <div className="user-info">
            <p className="user-name">Efrata</p>
            <p className="user-handle">@zeamanuel</p>
          </div>
        </div>

        <hr className="menu-divider" />

        {/* Menu Items */}
        <div className="menu-item" onClick={() => handleMenuItemClick('Dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Explore')}>
          <Search size={20} />
          <span>Explore</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Repositories')}>
          <Folder size={20} />
          <span>Repositories</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Workspaces')}>
          <Briefcase size={20} />
          <span>Workspaces</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </div>

        <hr className="menu-divider" />

        {/* Logout */}
        <div className="menu-item logout-item" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Log out</span>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
}

export default Header;