import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { NotificationContext } from '../../../context/NotificationContext/NotificationContext';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
    const { notifications, unreadCount, isLoading, notificationsEnabled, markAsRead, markAllAsRead, deleteNotification, refresh } = useContext(NotificationContext);

    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);
    const panelRef = useRef(null);

    const togglePanel = (e) => {
        e.stopPropagation();
        if (!notificationsEnabled) return;
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                panelRef.current && !panelRef.current.contains(event.target) &&
                bellRef.current && !bellRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleActionButton = (action, notificationId) => {
        switch (action.toLowerCase()) {
            case 'mark as read':
                markAsRead(notificationId);
                break;
            case 'reject':
            case 'ignore':
                deleteNotification(notificationId);
                break;
            default:
                break;
        }
    };

    return (
        <div className="relative">
            <button
                ref={bellRef}
                onClick={togglePanel}
                className={`p-2 rounded-md transition-colors relative group text-(--secondary-text-color) ${!notificationsEnabled ? 'opacity-50' : ''}`}
            >
                {notificationsEnabled ? (
                    <Bell size={24} className="group-hover:text-(--primary-text-color) transition-colors" />
                ) : (
                    <BellOff size={24} className="group-hover:text-(--primary-text-color) transition-colors" />
                )}
                {notificationsEnabled && unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-lg animate-in fade-in zoom-in duration-300 leading-none bg-(--notification-count-bg)"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div ref={panelRef} onClick={(e) => e.stopPropagation()}>
                    <NotificationPanel
                        notifications={notifications}
                        onClose={() => setIsOpen(false)}
                        onMarkAllAsRead={markAllAsRead}
                        onCloseNotification={deleteNotification}
                        onActionButton={handleActionButton}
                    />
                </div>
            )}
        </div>
    );
}
