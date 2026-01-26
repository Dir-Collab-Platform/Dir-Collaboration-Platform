import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { ChatContext } from './WorkspaceContext'
import { apiRequest } from '../../services/api/api';
import { useSocket } from '../SocketContext/SocketContext';
import { useAuth } from '../AuthContext/AuthContext';

export default function ChatProvider({ children }) {
    const { id: workspaceId } = useParams();
    const { socket, isConnected } = useSocket();
    const { user } = useAuth();
    const [users, setUsers] = useState([])
    const [channels, setChannels] = useState([])
    const [messages, setMessages] = useState([])
    const [activeChannelId, setActiveChannelId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // 1. Join workspace socket room when workspaceId changes
    useEffect(() => {
        if (!socket || !isConnected || !workspaceId) return;

        // Join workspace room - backend accepts both object and string
        socket.emit('joinWorkspace', workspaceId);

        return () => {
            // Leave workspace room on unmount
            socket.emit('leaveWorkspace', workspaceId);
        };
    }, [socket, isConnected, workspaceId]);

    // 2. Join channel socket room when active channel changes
    useEffect(() => {
        if (!socket || !isConnected || !workspaceId || !activeChannelId) return;

        // Join specific channel room
        socket.emit('joinChannel', { workspaceId, channelId: activeChannelId });

        return () => {
            // Leave channel room when switching
            socket.emit('leaveChannel', { workspaceId, channelId: activeChannelId });
        };
    }, [socket, isConnected, workspaceId, activeChannelId]);

    // 3. Fetch Channels & Members when workspace loads
    useEffect(() => {
        async function fetchInitialData() {
            // Validate workspaceId format (MongoDB ObjectId)
            // Non-imported repos (preview mode) won't have a valid MongoDB ID
            if (!workspaceId || !/^[0-9a-fA-F]{24}$/.test(workspaceId)) {
                // Not an error - just means this is a preview of a non-imported repo
                // Chat features are unavailable in preview mode
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const [channelsRes, membersRes] = await Promise.all([
                    apiRequest(`/api/repos/${workspaceId}/channels`),
                    apiRequest(`/api/repos/${workspaceId}/members`)
                ]);

                if (channelsRes.status === 'success') {
                    // Channels come as array from repository.channels
                    const channelList = channelsRes.data || [];
                    // Normalize channels to have consistent ID field
                    const normalizedChannels = channelList.map(ch => {
                        const channelId = ch.channel_id || ch._id;
                        return {
                            ...ch,
                            _id: channelId, // Always use _id for consistency
                            channel_id: channelId, // Keep channel_id as well for compatibility
                        };
                    });
                    setChannels(normalizedChannels);

                    // Set first channel (usually "general") as active
                    if (normalizedChannels.length > 0) {
                        setActiveChannelId(normalizedChannels[0]._id);
                    }
                }

                if (membersRes.status === 'success') {
                    // Normalize members list to user objects
                    const memberUsers = membersRes.data.map(m => ({
                        _id: m.userId?._id || m.userId,
                        githubUsername: m.userId?.githubUsername || m.userId?.username,
                        avatarUrl: m.userId?.avatarUrl,
                        role: m.role
                    }));
                    setUsers(memberUsers);
                }

            } catch (err) {
                console.error("Chat Init Data Error:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }
        fetchInitialData();
    }, [workspaceId]);

    // 4. Fetch Messages when Active Channel changes
    useEffect(() => {
        async function fetchMessages() {
            if (!workspaceId || !activeChannelId) return;

            try {
                const res = await apiRequest(`/api/repos/${workspaceId}/channels/${activeChannelId}/messages`);
                if (res.status === 'success') {
                    setMessages(res.data || []);
                }
            } catch (err) {
                console.error("Fetch Messages Error:", err);
                // Don't set global error here to avoid blocking UI, just log it
            }
        }
        fetchMessages();
    }, [workspaceId, activeChannelId]);

    // 5. Listen for real-time message events via Socket.IO
    useEffect(() => {
        if (!socket || !isConnected || !activeChannelId) return;

        const handleMessageReceived = (message) => {
            console.log('Received new message:', message);
            // Only add message if it's for the current active channel
            // Handle both channelId as ObjectId and string
            const messageChannelId = message.channelId?.toString() || message.channelId;
            const activeChannelIdStr = activeChannelId?.toString();

            if (messageChannelId === activeChannelIdStr) {
                setMessages(prev => {
                    // Avoid duplicates
                    const exists = prev.some(m => m._id?.toString() === message._id?.toString());
                    if (exists) return prev;
                    return [...prev, message];
                });
            }
        };

        const handleMessageDeleted = ({ messageId }) => {
            setMessages(prev => prev.filter(m => m._id !== messageId));
        };

        const handleReactionUpdate = ({ messageId, reactions }) => {
            setMessages(prev =>
                prev.map(m =>
                    m._id === messageId ? { ...m, reactions } : m
                )
            );
        };

        const handleChannelUpdated = ({ workspaceId: wsId, channel }) => {
            if (wsId === workspaceId) {
                setChannels(prev =>
                    prev.map(c =>
                        (c._id === channel.channel_id || c._id === channel._id)
                            ? { ...channel, _id: channel.channel_id || channel._id }
                            : c
                    )
                );
            }
        };

        const handleChannelDeleted = ({ workspaceId: wsId, channelId }) => {
            if (wsId === workspaceId) {
                setChannels(prev => prev.filter(c => c._id !== channelId));
                // If deleted channel was active, switch to first available channel
                if (activeChannelId === channelId) {
                    setChannels(prev => {
                        if (prev.length > 0) {
                            setActiveChannelId(prev[0]._id);
                        }
                        return prev;
                    });
                }
            }
        };

        const handleNewChannel = ({ workspaceId: wsId, channel }) => {
            if (wsId === workspaceId) {
                setChannels(prev => [...prev, { ...channel, _id: channel.channel_id || channel._id }]);
            }
        };

        const handleUserLeftChannel = ({ channelId, userId }) => {
            // If the current user left a channel (from another client or backend action)
            if (userId?.toString() === user?._id?.toString()) {
                // Find the channel to check if it's private
                const channel = channels.find(c => c._id === channelId || c.channel_id === channelId);
                if (channel?.isPrivate) {
                    // Remove private channel from list
                    setChannels(prev => prev.filter(c => c._id !== channelId));

                    // Switch active channel if needed
                    if (activeChannelId === channelId) {
                        const general = channels.find(c => c.name === 'general' && c._id !== channelId);
                        if (general) {
                            setActiveChannelId(general._id);
                        } else {
                            const firstAvailable = channels.find(c => c._id !== channelId);
                            setActiveChannelId(firstAvailable?._id || null);
                        }
                    }
                }
            }
        };

        // Listen to channel-specific room events
        socket.on('message_received', handleMessageReceived);
        socket.on('message_deleted', handleMessageDeleted);
        socket.on('reaction_update', handleReactionUpdate);
        socket.on('channel_updated', handleChannelUpdated);
        socket.on('channel_deleted', handleChannelDeleted);
        socket.on('new_channel', handleNewChannel);
        socket.on('user_left_channel', handleUserLeftChannel);

        return () => {
            socket.off('message_received', handleMessageReceived);
            socket.off('message_deleted', handleMessageDeleted);
            socket.off('reaction_update', handleReactionUpdate);
            socket.off('channel_updated', handleChannelUpdated);
            socket.off('channel_deleted', handleChannelDeleted);
            socket.off('new_channel', handleNewChannel);
            socket.off('user_left_channel', handleUserLeftChannel);
        };
    }, [socket, isConnected, activeChannelId, workspaceId]);

    /**
     * Helper to get the currently active channel object using _id
     */
    const activeChannel = channels.find(c =>
        c._id === activeChannelId || c.channel_id === activeChannelId
    );

    // Enrich messages with sender info and aggregated reactions
    const enrichedMessages = messages.map(msg => {
        // Handle both populated sender or raw ID
        const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
        const sender = users.find(u => u._id?.toString() === senderId?.toString()) ||
            (typeof msg.senderId === 'object' ? msg.senderId : {});

        // Aggregate reactions
        const rawReactions = msg.reactions || [];
        const reactionCounts = rawReactions.reduce((acc, r) => {
            const emoji = r.emoji;
            if (!acc[emoji]) {
                acc[emoji] = { emoji, count: 0, userIds: [] };
            }
            acc[emoji].count += 1;
            const rUserId = r.userId?._id || r.userId;
            if (rUserId) acc[emoji].userIds.push(rUserId.toString());
            return acc;
        }, {});

        const aggregatedReactions = Object.values(reactionCounts);

        return {
            ...msg,
            senderAvatar: sender?.avatarUrl,
            senderName: sender?.githubUsername || sender?.username || "Unknown",
            reactions: aggregatedReactions,
            rawReactions: rawReactions
        };
    });

    /**
     * Send a new message
     */
    async function sendMessage(content) {
        if (!activeChannelId || !workspaceId) {
            throw new Error('No active channel or workspace');
        }

        try {
            const res = await apiRequest(`/api/repos/${workspaceId}/channels/${activeChannelId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content }), // Backend infers sender from token
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 'success') {
                // Message will be added via socket event, but we can add optimistically
                // Or wait for socket confirmation - safer to wait for socket
                return res.data;
            }
        } catch (err) {
            console.error("Send Message Error:", err);
            throw err;
        }
    }

    /**
     * Create a new channel
     */
    async function createChannel(name, options = {}) {
        if (!workspaceId || !/^[0-9a-fA-F]{24}$/.test(workspaceId)) {
            throw new Error('Invalid workspace ID');
        }

        try {
            const res = await apiRequest(`/api/repos/${workspaceId}/channels`, {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    isPrivate: options.isPrivate,
                    participants: options.participants // Array of user IDs
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 'success') {
                // Channel will be added via socket event 'new_channel'
                // Remove optimistic update to prevent duplicates
                return {
                    ...res.data,
                    _id: res.data.channel_id || res.data._id
                };
            }
            throw new Error(res.message || 'Failed to create channel');
        } catch (err) {
            console.error("Create Channel Error:", err);
            throw err;
        }
    }


    /**
     * Delete a channel
     */
    async function deleteChannel(channelId) {
        if (!workspaceId || !/^[0-9a-fA-F]{24}$/.test(workspaceId)) {
            throw new Error('Invalid workspace ID');
        }

        try {
            const res = await apiRequest(`/api/repos/${workspaceId}/channels/${channelId}`, {
                method: 'DELETE'
            });

            if (res.status === 'success') {
                // Remove channel from local state
                setChannels(prev => prev.filter(c => c._id !== channelId));
                // If deleted channel was active, switch to first available
                if (activeChannelId === channelId) {
                    setChannels(prev => {
                        if (prev.length > 0) {
                            setActiveChannelId(prev[0]._id);
                        }
                        return prev;
                    });
                }
                return true;
            }
            throw new Error(res.message || 'Failed to delete channel');
        } catch (err) {
            console.error("Delete Channel Error:", err);
            throw err;
        }
    }

    /**
     * Add or Toggle Reaction to a message
     */
    async function addReaction(messageId, emoji) {
        if (!workspaceId) return;

        try {
            // Optimistic Update
            setMessages(prev => prev.map(msg => {
                if (msg._id === messageId) {
                    const currentUserId = user?._id || user?.id;
                    if (!currentUserId) return msg;

                    const rawReactions = msg.reactions || [];
                    // Check if I already reacted
                    const existingIndex = rawReactions.findIndex(r => {
                        const rUserId = r.userId?._id || r.userId;
                        return rUserId?.toString() === currentUserId.toString() && r.emoji === emoji;
                    });

                    let newReactions = [...rawReactions];
                    if (existingIndex > -1) {
                        // Toggle Off: Remove
                        newReactions.splice(existingIndex, 1);
                    } else {
                        // Toggle On: Add
                        newReactions.push({
                            emoji,
                            userId: { _id: currentUserId, githubUsername: user.githubUsername }
                        });
                    }
                    return { ...msg, reactions: newReactions };
                }
                return msg;
            }));

            const res = await apiRequest(`/api/messages/${messageId}/reactions`, {
                method: 'PUT',
                body: JSON.stringify({ emoji, repoId: workspaceId }),
                headers: { 'Content-Type': 'application/json' }
            });

            return res.data;
        } catch (err) {
            console.error("Add Reaction Error:", err);
        }
    }

    /**
     * Leave a channel
     */
    async function leaveChannel(channelId) {
        if (!workspaceId || !channelId) return;

        try {
            // Find the channel to check if it's private
            const channelToLeave = channels.find(c => c._id === channelId || c.channel_id === channelId);
            const isPrivateChannel = channelToLeave?.isPrivate;

            const res = await apiRequest(`/api/repos/${workspaceId}/channels/${channelId}/leave`, {
                method: 'POST'
            });

            if (res.status === 'success') {
                // If it's a private channel, remove it from the list (user loses access)
                if (isPrivateChannel) {
                    setChannels(prev => prev.filter(c => c._id !== channelId));
                }

                // If we're currently viewing this channel, switch to another
                if (activeChannelId === channelId) {
                    // Switch to General or first available
                    const general = channels.find(c => c.name === 'general' && c._id !== channelId);
                    if (general) {
                        setActiveChannelId(general._id);
                    } else {
                        // Find first available channel that's not the one we're leaving
                        const firstAvailable = channels.find(c => c._id !== channelId);
                        if (firstAvailable) {
                            setActiveChannelId(firstAvailable._id);
                        } else {
                            setActiveChannelId(null);
                        }
                    }
                }
                return true;
            }
        } catch (err) {
            console.error("Leave Channel Error:", err);
            throw err;
        }
    }

    const value = {
        users,
        channels,
        messages: enrichedMessages,
        activeChannelId,
        activeChannel,
        activeMessages: enrichedMessages,
        isLoading,
        error,
        setActiveChannelId,
        sendMessage,
        createChannel,
        deleteChannel,
        addReaction,
        leaveChannel
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
