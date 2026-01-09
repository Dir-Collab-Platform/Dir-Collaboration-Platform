import React, { useState, useEffect, useCallback } from 'react';
import { NotificationContext } from './NotificationContext';
import { useSocket } from '../SocketContext/SocketContext';
import { apiRequest } from '../../services/api/api';
import { useAuth } from '../AuthContext/AuthContext';

export default function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();

    // Fetch initial notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?._id) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await apiRequest('/api/notifications');
                if (response.status === 'success') {
                    setNotifications(response.data || []);
                    const unread = (response.data || []).filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotifications();
    }, [user?._id]);

    // Listen for real-time notifications via Socket.IO
    useEffect(() => {
        if (!socket || !isConnected || !user?._id) return;

        // Join user's private notification room
        const userId = user._id;
        socket.emit('joinWorkspace', userId); // Backend joins user:${userId} on connect, but we can also join manually

        // Listen for new notifications
        const handleNewNotification = (notification) => {
            console.log('Received new notification:', notification);
            setNotifications(prev => [notification, ...prev]);
            
            // Only increment unread if notification is for current user
            if (notification.userId === userId || notification.userId === userId.toString()) {
                setUnreadCount(prev => prev + 1);
            }
        };

        socket.on('new_notification', handleNewNotification);

        return () => {
            socket.off('new_notification', handleNewNotification);
        };
    }, [socket, isConnected, user?._id]);

    const markAsRead = useCallback(async (notificationId) => {
        try {
            const response = await apiRequest(`/api/notifications/${notificationId}/read`, {
                method: 'PATCH'
            });

            if (response.status === 'success') {
                setNotifications(prev =>
                    prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            // Backend doesn't have a bulk mark-all endpoint yet, so we'll do it client-side
            // Or we can update each one individually
            const unreadNotifications = notifications.filter(n => !n.isRead);
            
            await Promise.all(
                unreadNotifications.map(n => markAsRead(n._id))
            );
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, [notifications, markAsRead]);

    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const response = await apiRequest(`/api/notifications/${notificationId}`, {
                method: 'DELETE'
            });

            if (response.status === 'success') {
                const deleted = notifications.find(n => n._id === notificationId);
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
                if (deleted && !deleted.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
            throw error;
        }
    }, [notifications]);

    const value = {
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh: () => {
            // Trigger refresh
            setIsLoading(true);
            const fetchNotifications = async () => {
                try {
                    const response = await apiRequest('/api/notifications');
                    if (response.status === 'success') {
                        setNotifications(response.data || []);
                        const unread = (response.data || []).filter(n => !n.isRead).length;
                        setUnreadCount(unread);
                    }
                } catch (error) {
                    console.error('Failed to refresh notifications:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchNotifications();
        }
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
