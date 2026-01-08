import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ChatContext } from './WorkspaceContext'
import { mockWorkspaces, mockMessages, mockUsers } from '../../data/mockData';

export default function ChatProvider({ children }) {
    const { id: workspaceId } = useParams();
    const [users, setUsers] = useState([])
    const [channels, setChannels] = useState([])
    const [messages, setMessages] = useState([])
    const [activeChannelId, setActiveChannelId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchChatData() {
            if (!workspaceId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true)
            try {
                // TODO: Replace with real API calls when integrating backend
                // const [channelsRes, messagesRes, membersRes] = await Promise.all([
                //     axios.get(`/api/repos/${workspaceId}/channels`),
                //     axios.get(`/api/repos/${workspaceId}/channels/${channelId}/messages`),
                //     axios.get(`/api/repos/${workspaceId}/members`)
                // ]);
                // setChannels(channelsRes.data.data);
                // setMessages(messagesRes.data.data);
                // setUsers(membersRes.data.data.map(m => m.userId));
                
                // Mock implementation
                await new Promise(resolve => setTimeout(resolve, 400));
                
                const workspace = mockWorkspaces.find(ws => ws._id === workspaceId);
                if (!workspace) {
                    throw new Error("Workspace not found");
                }

                // Get all members as users
                const workspaceUsers = workspace.members.map(mem => {
                    const user = mockUsers.find(u => u._id === mem.userId);
                    return user || { _id: mem.userId, githubUsername: "Unknown", avatarUrl: "" };
                });
                setUsers(workspaceUsers);

                // Get channels for this workspace
                const workspaceChannels = workspace.channels || [];
                setChannels(workspaceChannels);

                // Get messages for all channels in this workspace
                const channelIds = workspaceChannels.map(ch => ch._id);
                const workspaceMessages = mockMessages.filter(msg => 
                    channelIds.includes(msg.channelId)
                );
                setMessages(workspaceMessages);

                // Set default active channel
                if (workspaceChannels.length > 0) {
                    setActiveChannelId(workspaceChannels[0]._id);
                }

            } catch (err) {
                console.error("Chat Data Fetch Error:", err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchChatData()
    }, [workspaceId])

    /**
     * Helper to get the currently active channel object using _id
     */
    const activeChannel = channels.find(c => c._id === activeChannelId)

    /**
     * Helper to get messages filtered by the active channel's _id
     */
    const activeMessages = messages.filter(m => m.channelId === activeChannelId)

    // Enrich messages with sender info
    const enrichedMessages = activeMessages.map(msg => {
        const sender = users.find(u => u._id === msg.senderId);
        return {
            ...msg,
            senderAvatar: sender?.avatarUrl,
            senderName: sender?.githubUsername || "Unknown"
        };
    });

    /**
     * Send a new message
     */
    function sendMessage(content, senderId) {
        const newMessage = {
            _id: `msg_${Date.now()}`,
            channelId: activeChannelId,
            senderId: senderId,
            content: content,
            createdAt: new Date().toISOString(),
            attachments: [],
            reactions: [],
            mentions: [],
            comments: []
        }
        setMessages(prev => [...prev, newMessage])
        return newMessage;
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
        sendMessage
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
