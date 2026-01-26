import { useContext, useEffect, useRef, useState } from 'react'
import { Paperclip, Send, Lock } from "lucide-react"
import { ChatContext, WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'
import { useAuth } from '../../../../context/AuthContext/AuthContext'
import MessageBubble from './MessageBubble'
import { hasPermission } from '../../../../constants/roles'

/**
 * Chat Input Component
 */
function ChatInput({ onSendMessage }) {
    const [inputValue, setInputValue] = useState("")

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue)
            setInputValue("")
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-4 pt-0">
            <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-end bg-(--card-bg-lighter2) border border-(--main-border-color) rounded-xl px-3 py-2 focus-within:border-(--active-text-color) transition-colors shadow-inner">
                <button className="p-2 text-(--secondary-text-color) hover:text-(--active-text-color) transition-colors">
                    <Paperclip size={20} />
                </button>

                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="bg-transparent text-sm text-(--primary-text-color) placeholder:text-(--secondary-text-color) placeholder:opacity-50 outline-none resize-none py-2 max-h-32 custom-scrollbar"
                    rows={1}
                    style={{ minHeight: '40px' }}
                />

                <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className="p-2 text-(--active-text-color) hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    )
}

/**
 * Read-only message for users without write permission
 */
function ReadOnlyMessage({ reason }) {
    return (
        <div className="p-4 pt-0">
            <div className="flex items-center justify-center gap-3 bg-(--card-bg-lighter2) border border-(--main-border-color) rounded-xl px-4 py-3">
                <Lock size={16} className="text-(--secondary-text-color)" />
                <p className="text-xs text-(--secondary-text-color)">
                    {reason || "You don't have permission to send messages in this channel"}
                </p>
            </div>
        </div>
    )
}

/**
 * Main Chat Container
 * Uses strict context filtering to fix channel message persistence issues
 */
export default function Chat() {
    const chatContext = useContext(ChatContext)
    const { repository } = useContext(WorkspaceContext)
    const scrollRef = useRef(null)

    // Ensure scroll to bottom on mount and message updates
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [chatContext?.activeMessages])

    if (!chatContext) return (
        <div className="flex grow items-center justify-center bg-(--card-bg)">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-(--active-text-color) border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-(--secondary-text-color) animate-pulse">Syncing chat...</p>
            </div>
        </div>
    )

    const { activeMessages, sendMessage, activeChannel } = chatContext
    const { user } = useAuth()
    const currentUserId = user?._id || user?.id

    const handleSendMessage = async (text) => {
        try {
            await sendMessage(text)
        } catch (error) {
            console.error('Failed to send message:', error)
        }
    }

    // Check user permissions
    const currentMember = repository?.members?.find(m => m.id === currentUserId);
    const userRole = currentMember?.role || 'viewer';
    const canWrite = hasPermission(userRole, 'write');

    // For private channels, also check if user is a participant
    const isPrivateChannel = activeChannel?.isPrivate;
    const isParticipant = isPrivateChannel
        ? activeChannel?.participants?.some(p => p.toString() === currentUserId?.toString())
        : true;

    const canSendMessages = canWrite && isParticipant;

    let readOnlyReason = null;
    if (!canWrite) {
        readOnlyReason = "Your role doesn't allow sending messages";
    } else if (isPrivateChannel && !isParticipant) {
        readOnlyReason = "You are not a member of this private channel";
    }

    return (
        <div className="chat grid grid-rows-[1fr_auto] h-155 bg-(--card-bg-lighter) border border-(--main-border-color) rounded-2xl">
            <div
                ref={scrollRef}
                className="overflow-y-auto invisible-scrollbar px-6 min-h-0"
            >
                <div className="flex flex-col gap-6 justify-end min-h-full py-4">
                    {activeMessages?.length ? (
                        activeMessages.map(msg => {
                            // Handle both populated senderId object and string ID
                            const messageSenderId = typeof msg.senderId === 'object'
                                ? msg.senderId?._id || msg.senderId?.id
                                : msg.senderId
                            const isCurrentUser = messageSenderId?.toString() === currentUserId?.toString()

                            return (
                                <MessageBubble
                                    key={msg._id}
                                    message={msg}
                                    isCurrentUser={isCurrentUser}
                                />
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-40 gap-3">
                            <p className="text-sm text-(--secondary-text-color)">No messages yet. Start the conversation!</p>
                        </div>
                    )}
                </div>
            </div>

            {canSendMessages ? (
                <ChatInput onSendMessage={handleSendMessage} />
            ) : (
                <ReadOnlyMessage reason={readOnlyReason} />
            )}
        </div>
    )
}