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
                    // console.log('Fetched notifications: ', response.data)
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
            // Check if notifications are enabled in user preferences
            if (user?.preferences?.notificationsEnabled === false) {
                console.log('SOCKET: Received new_notification but notifications are disabled in preferences. Ignoring.');
                return;
            }

            console.log('SOCKET: Received new_notification event:', notification);
            setNotifications(prev => [notification, ...prev]);

            // Only increment unread if notification is for current user
            const isTarget = notification.userId === userId || notification.userId === userId.toString();
            console.log(`SOCKET: Notification for current user? ${isTarget} (Notif userId: ${notification.userId}, Current userId: ${userId})`);

            if (isTarget) {
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
                // Recalculate unread count to be safe
                setNotifications(current => {
                    const unread = current.filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                    return current;
                });

                // Backend emits stats_updated socket event which DashboardProvider listens to
                // This will automatically refresh the Dashboard notification count
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            throw error;
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            const unreadNotifications = notifications.filter(n => !n.isRead);
            if (unreadNotifications.length === 0) return;

            // Optimistic update
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);

            await Promise.all(
                unreadNotifications.map(n => apiRequest(`/api/notifications/${n._id}/read`, { method: 'PATCH' }))
            );

            // Backend emits stats_updated socket event for each notification marked as read
            // DashboardProvider listens to this and will automatically refresh
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            // Re-fetch to sync if failed
            const response = await apiRequest('/api/notifications');
            if (response.status === 'success') {
                setNotifications(response.data || []);
                setUnreadCount((response.data || []).filter(n => !n.isRead).length);
            }
        }
    }, [notifications]);

    const deleteNotification = useCallback(async (notificationId) => {
        try {
            const response = await apiRequest(`/api/notifications/${notificationId}`, {
                method: 'DELETE'
            });

            if (response.status === 'success') {
                setNotifications(prev => {
                    const next = prev.filter(n => n._id !== notificationId);
                    setUnreadCount(next.filter(n => !n.isRead).length);
                    return next;
                });
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
            throw error;
        }
    }, []);

    const refresh = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiRequest('/api/notifications');
            if (response.status === 'success') {
                setNotifications(response.data || []);
                setUnreadCount((response.data || []).filter(n => !n.isRead).length);
            }
        } catch (error) {
            console.error('Failed to refresh notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        notifications,
        unreadCount,
        isLoading,
        notificationsEnabled: user?.preferences?.notificationsEnabled !== false,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
