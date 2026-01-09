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

    // Helper to format time as "5m", "2h", "1d"
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d`;
    };

    // Helper to transform backend notification to UI format
    const transformNotification = (n) => {
        let msgContent = n.message || "";

        // Defensive: Check if message is JSON (user hint)
        if (typeof msgContent === 'string' && (msgContent.startsWith('{') || msgContent.startsWith('['))) {
            try {
                const parsed = JSON.parse(msgContent);
                // Assume parsed object might have 'content' or 'text' or be the message itself
                if (typeof parsed === 'object') {
                    msgContent = parsed.content || parsed.text || parsed.message || JSON.stringify(parsed);
                } else {
                    msgContent = String(parsed);
                }
            } catch (e) {
                // Not JSON, keep as is
            }
        }

        // Defensive: Check if repoId is populated
        const workspaceName = (n.repoId && typeof n.repoId === 'object' && n.repoId.workspaceName)
            ? n.repoId.workspaceName
            : 'General';

        return {
            ...n,
            id: n._id,
            // Map backend types to UI types ('message', 'github', 'alert')
            type: ['message', 'mention', 'comment'].includes(n.type) ? 'message' : 'alert',
            label: n.type || 'Notification',
            time: formatTimeAgo(n.createdAt),
            channel: workspaceName,
            userImg: "https://github.com/identicons/default.png", // specific sender not in model yet
            userName: "User",
            fullMessage: msgContent || "(No message content)",
            shortMessage: (msgContent || "(No message content)").length > 50
                ? (msgContent || "").substring(0, 50) + '...'
                : (msgContent || "(No message content)"),
            hasMore: (msgContent || "").length > 50,
            read: n.isRead, // Ensure this property exists for UI

            // For github/alert types
            repo: workspaceName,
            user: "User",
            fullPR: msgContent || "(No content)",
            shortPR: (msgContent || "").length > 50
                ? (msgContent || "").substring(0, 50) + '...'
                : (msgContent || "(No content)"),
            fullAlert: msgContent || "(No alert content)",
            shortAlert: (msgContent || "").length > 50
                ? (msgContent || "").substring(0, 50) + '...'
                : (msgContent || "(No alert content)"),
        };
    };

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
                    const rawData = response.data || [];
                    const formattedData = rawData.map(transformNotification);
                    setNotifications(formattedData);

                    const unread = formattedData.filter(n => !n.read).length;
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

        const userId = user._id;
        socket.emit('joinWorkspace', userId);

        const handleNewNotification = (notification) => {
            console.log('Received new notification:', notification);
            const formatted = transformNotification(notification);

            setNotifications(prev => [formatted, ...prev]);

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
                    prev.map(n => n._id === notificationId ? { ...n, isRead: true, read: true } : n)
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
            const unreadNotifications = notifications.filter(n => !n.read);

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
                if (deleted && !deleted.read) {
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
                        const rawData = response.data || [];
                        const formattedData = rawData.map(transformNotification);
                        setNotifications(formattedData);
                        const unread = formattedData.filter(n => !n.read).length;
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
