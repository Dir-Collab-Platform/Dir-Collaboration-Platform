import React, { useState, useEffect } from 'react'
import { ChatContext } from './WorkspaceContext'

export default function ChatProvider({ children }) {
    const [users, setUsers] = useState([])
    const [channels, setChannels] = useState([])
    const [messages, setMessages] = useState([])
    const [activeChannelId, setActiveChannelId] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchChatData() {
            setIsLoading(true)
            try {
                const response = await fetch('/data/chat-db.json')
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch chat data: ${response.statusText}`)
                }

                const data = await response.json()

                setUsers(data.users || [])
                setChannels(data.channels || [])
                setMessages(data.messages || [])

                // Use _id to set the default active channel
                if (data.channels && data.channels.length > 0) {
                    setActiveChannelId(data.channels[0]._id)
                }

            } catch (err) {
                console.error("Chat Data Fetch Error:", err)
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchChatData()
    }, [])

    /**
     * Helper to get the currently active channel object using _id
     */
    const activeChannel = channels.find(c => c._id === activeChannelId)

    /**
     * Helper to get messages filtered by the active channel's _id
     */
    const activeMessages = messages.filter(m => m.channelId === activeChannelId)

    activeMessages.forEach(msg => {
        msg.senderAvatar = users?.find(u => u._id === msg.senderId)?.avatarUrl
        msg.senderName = users.find(u => u._id === msg.senderId).githubUsername
    })

    /**
     * Mock function to add a new message
     */
    function sendMessage(content, senderId) {
        const newMessage = {
            _id: `msg_${Date.now()}`,
            channelId: activeChannelId, // Linking the message to the active channel's _id
            senderId: senderId,
            content: content,
            createdAt: new Date().toISOString(),
            attachments: [],
            reactions: [],
            mentions: [],
            comments: []
        }
        setMessages(prev => [...prev, newMessage])
    }

    const value = {
        users,
        channels,
        messages,
        activeChannelId,
        activeChannel,
        activeMessages,
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