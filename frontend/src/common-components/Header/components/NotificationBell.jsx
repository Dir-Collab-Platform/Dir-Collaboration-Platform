import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bell } from 'lucide-react';
import { NotificationContext } from '../../../context/NotificationContext/NotificationContext';
import NotificationPanel from './NotificationPanel';

export default function NotificationBell() {
    const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead, deleteNotification, refresh } = useContext(NotificationContext);

    const [isOpen, setIsOpen] = useState(false);
    const bellRef = useRef(null);
    const panelRef = useRef(null);

    const togglePanel = (e) => {
        e.stopPropagation();
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
                className="p-2 rounded-md transition-colors relative group"
                style={{ color: 'var(--secondary-text-color)' }}
            >
                <Bell size={24} className="group-hover:text-(--primary-text-color) transition-colors" />
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 text-white text-[2px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm animate-in fade-in zoom-in duration-300 line-height-0"
                        style={{ backgroundColor: 'var(--notification-count-bg)' }}
                    >
                        {unreadCount}
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
