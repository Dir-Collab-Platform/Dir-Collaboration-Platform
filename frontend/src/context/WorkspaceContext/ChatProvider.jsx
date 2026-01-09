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

    // 3. OPTIMIZED: Parallel Initial Data Fetch
    useEffect(() => {
        let isMounted = true;

        async function fetchInitialData() {
            // 1. Quick Validation
            if (!workspaceId || !/^[0-9a-fA-F]{24}$/.test(workspaceId)) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // 2. Fetch Channels and Members at the same time
                const [channelsRes, membersRes] = await Promise.all([
                    apiRequest(`/api/repos/${workspaceId}/channels`),
                    apiRequest(`/api/repos/${workspaceId}/members`)
                ]);

                if (!isMounted) return;

                // 3. Process Members
                if (membersRes.status === 'success') {
                    setUsers(membersRes.data.map(m => ({
                        _id: m.userId?._id || m.userId,
                        githubUsername: m.userId?.githubUsername || m.userId?.username,
                        avatarUrl: m.userId?.avatarUrl,
                        role: m.role
                    })));
                }

                // 4. Process Channels & Immediately trigger Message fetch
                if (channelsRes.status === 'success') {
                    const channelList = channelsRes.data || [];
                    const normalizedChannels = channelList.map(ch => ({
                        ...ch,
                        _id: ch.channel_id || ch._id,
                        channel_id: ch.channel_id || ch._id,
                    }));
                    setChannels(normalizedChannels);

                    if (normalizedChannels.length > 0) {
                        const firstChannelId = normalizedChannels[0]._id;
                        setActiveChannelId(firstChannelId);

                        // --- THE CRITICAL SPEED FIX ---
                        // Fire off the message request but DON'T "await" it before closing the loader
                        apiRequest(`/api/repos/${workspaceId}/channels/${firstChannelId}/messages`)
                            .then(msgRes => {
                                if (isMounted && msgRes.status === 'success') {
                                    setMessages(msgRes.data || []);
                                }
                            });
                    }
                }

            } catch (err) {
                console.error("Chat Init Error:", err);
                if (isMounted) setError(err.message);
            } finally {
                // 5. UNBLOCK UI IMMEDIATELY
                // The messages will populate half a second later via the .then() above
                if (isMounted) setIsLoading(false);
            }
        }
        fetchInitialData();
        return () => { isMounted = false; };
    }, [workspaceId]);

    // 4. Update Message fetcher to ONLY trigger on manual channel switches
    useEffect(() => {
        // Skip if it's the initial load (handled above)
        if (isLoading || !workspaceId || !activeChannelId) return;

        async function fetchMessages() {
            const res = await apiRequest(`/api/repos/${workspaceId}/channels/${activeChannelId}/messages`);
            if (res.status === 'success') setMessages(res.data || []);
        }
        fetchMessages();
    }, [activeChannelId]);

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

        // Listen to channel-specific room events
        socket.on('message_received', handleMessageReceived);
        socket.on('message_deleted', handleMessageDeleted);
        socket.on('reaction_update', handleReactionUpdate);
        socket.on('channel_updated', handleChannelUpdated);
        socket.on('channel_deleted', handleChannelDeleted);
        socket.on('new_channel', handleNewChannel);

        return () => {
            socket.off('message_received', handleMessageReceived);
            socket.off('message_deleted', handleMessageDeleted);
            socket.off('reaction_update', handleReactionUpdate);
            socket.off('channel_updated', handleChannelUpdated);
            socket.off('channel_deleted', handleChannelDeleted);
            socket.off('new_channel', handleNewChannel);
        };
    }, [socket, isConnected, activeChannelId, workspaceId]);

    /**
     * Helper to get the currently active channel object using _id
     */
    const activeChannel = channels.find(c =>
        c._id === activeChannelId || c.channel_id === activeChannelId
    );

    // Enrich messages with sender info
    const enrichedMessages = messages.map(msg => {
        // Handle both populated sender or raw ID
        const senderId = typeof msg.senderId === 'object' ? msg.senderId?._id : msg.senderId;
        const sender = users.find(u => u._id?.toString() === senderId?.toString()) ||
            (typeof msg.senderId === 'object' ? msg.senderId : {});

        return {
            ...msg,
            senderAvatar: sender?.avatarUrl,
            senderName: sender?.githubUsername || sender?.username || "Unknown"
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
    async function createChannel(name) {
        if (!workspaceId || !/^[0-9a-fA-F]{24}$/.test(workspaceId)) {
            throw new Error('Invalid workspace ID');
        }

        try {
            const res = await apiRequest(`/api/repos/${workspaceId}/channels`, {
                method: 'POST',
                body: JSON.stringify({ name }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 'success') {
                // Channel will be added via socket event 'new_channel'
                // But we can also add it optimistically
                const newChannel = {
                    ...res.data,
                    _id: res.data.channel_id || res.data._id
                };
                setChannels(prev => [...prev, newChannel]);
                return newChannel;
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
        deleteChannel
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
