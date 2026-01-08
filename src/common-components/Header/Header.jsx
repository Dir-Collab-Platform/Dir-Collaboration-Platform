import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Menu } from 'lucide-react';

import NotificationPanel from './components/NotificationPanel';
import CreateRepoModal from './components/CreateRepoModal';
import SidebarMenu from './components/SidebarMenu';
import Logo from '../Logo';
import { mockNotifications, mockPastNotifications } from '../../data/mockData';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCreateRepoOpen, setIsCreateRepoOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const [pastNotifications, setPastNotifications] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [isLoadingPast, setIsLoadingPast] = useState(false);

  const notificationPanelRef = useRef(null);
  const bellBtnRef = useRef(null);

  const handleNewRepoClick = () => {
    setIsCreateRepoOpen(true);
  };

  const handleCloseCreateRepo = () => {
    setIsCreateRepoOpen(false);
  };

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
      setPastNotifications(prev => [...mockPastNotifications, ...prev]);
      setIsLoadingPast(false);
    }, 1200);
  };

  const handleActionButton = (action, notificationId) => {
    switch (action.toLowerCase()) {
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

  return (
    <>
      <nav
        className="p-4 fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'var(--dark-bg)',
          borderBottom: '1px solid var(--main-border-color)'
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-6">
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

              {isNotificationOpen && (
                <div ref={notificationPanelRef}>
                  <NotificationPanel
                    notifications={notifications}
                    pastNotifications={pastNotifications}
                    expandedMessages={expandedMessages}
                    isLoadingPast={isLoadingPast}
                    onClose={closeNotificationPanel}
                    onMarkAllAsRead={handleMarkAllAsRead}
                    onCloseNotification={handleCloseNotification}
                    onActionButton={handleActionButton}
                    onToggleMessageExpansion={toggleMessageExpansion}
                    onLoadPastNotifications={handleLoadPastNotifications}
                  />
                </div>
              )}
            </div>

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

      <SidebarMenu
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {isCreateRepoOpen && (
        <CreateRepoModal
          onClose={handleCloseCreateRepo}
        />
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="pt-8"></div>
    </>
  );
}

export default Header;
