import { useContext, useEffect, useRef, useState } from 'react'
import { Paperclip, Send } from "lucide-react"
import { ChatContext } from '../../../../context/WorkspaceContext/WorkspaceContext'
import MessageBubble from './MessageBubble'

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
 * Main Chat Container
 * Uses strict context filtering to fix channel message persistence issues
 */
export default function Chat() {
    const chatContext = useContext(ChatContext)
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
    // replace this with the user id of the authenticated user
    const CURRENT_USER_ID = "658af5c2f1a2b3c4d5e6f001" 

    return (
        <div className="chat grid grid-rows-[1fr_auto] h-155 bg-(--card-bg-lighter) border border-(--main-border-color) rounded-2xl">
            <div
                ref={scrollRef}
                className="overflow-y-auto invisible-scrollbar px-6 min-h-0"
            >
                <div className="flex flex-col gap-6 justify-end min-h-full py-4">
                    {activeMessages?.length ? (
                        activeMessages.map(msg => (
                            <MessageBubble
                                key={msg._id}
                                message={msg}
                                isCurrentUser={msg.senderId === CURRENT_USER_ID}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full opacity-40 gap-3">
                            ...
                        </div>
                    )}
                </div>
            </div>

            <ChatInput onSendMessage={(text) => sendMessage(text, CURRENT_USER_ID)} />
        </div>
    )
}