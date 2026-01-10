import { Smile } from "lucide-react"
import Avatar from "./Avatar"
import { useState, useRef, useEffect, useContext } from 'react'
import { ChatContext } from '../../../../context/WorkspaceContext/WorkspaceContext'

const USUAL_REACTIONS = ["👍", "👎", "😄", "🎉", "😕", "❤️", "🚀", "👀"];

function EmojiPicker({ onSelect, onClose }) {
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={ref} className="absolute z-(--z-popup) bottom-full mb-2 left-0 bg-(--bg-card) border border-(--border-main) rounded-lg shadow-2xl p-2 flex gap-1 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
            {USUAL_REACTIONS.map(emoji => (
                <button
                    key={emoji}
                    onClick={() => onSelect(emoji)}
                    className="p-1.5 hover:bg-(--bg-card-hover) rounded-md transition-colors text-lg active:scale-125"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}

export default function MessageBubble({ message, isCurrentUser }) {
    const { addReaction } = useContext(ChatContext);
    const timeString = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const [showPicker, setShowPicker] = useState(false);

    const handleEmojiSelect = async (emoji) => {
        await addReaction(message._id, emoji);
        setShowPicker(false);
    };

    return (
        <div className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300 relative group`}>
            {!isCurrentUser && (
                <div className="shrink-0 mt-1">
                    <Avatar
                        src={message.senderAvatar}
                        size={32}
                    />
                </div>
            )}

            <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[75%] ${isCurrentUser ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Reaction Button */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity relative shrink-0 mb-6">
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="p-1 px-2 hover:bg-(--bg-card-hover) rounded-full transition-all text-(--text-secondary) hover:text-(--text-primary)"
                        title="Add reaction"
                    >
                        <Smile size={18} />
                    </button>
                    {showPicker && (
                        <div className={`absolute z-(--z-popup) bottom-full mb-2 ${isCurrentUser ? 'right-0' : 'left-0'}`}>
                            <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowPicker(false)} />
                        </div>
                    )}
                </div>

                <div className={`flex flex-col gap-1 ${isCurrentUser ? 'items-end' : 'items-start'} min-w-0`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm border border-black/5
                        ${isCurrentUser
                            ? 'bg-(--sent-message) rounded-br-none text-white'
                            : 'bg-(--received-message) rounded-bl-none text-(--text-primary)'}
                    `}>
                        {/* the sender's name if the sender is not the current user */}
                        {!isCurrentUser &&
                            <div className="font-bold text-[10px] mb-1 text-(--text-secondary) uppercase tracking-tight">
                                {message.senderName}
                            </div>
                        }

                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>

                    {/* Reactions Display */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {message.reactions.map((reaction, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleEmojiSelect(reaction.emoji)}
                                    className="flex items-center gap-2 bg-(--bg-card) border border-(--border-main) rounded-full px-2.5 py-1 text-[11px] hover:border-(--text-active) transition-colors cursor-pointer shadow-sm group/reaction"
                                    title="React"
                                >
                                    <span>{reaction.emoji}</span>
                                    {reaction.count > 0 && <span className="text-(--text-secondary) font-bold group-hover/reaction:text-(--text-active)">{reaction.count}</span>}
                                </button>
                            ))}
                        </div>
                    )}

                    <span className="text-[10px] text-(--text-secondary) opacity-50 font-medium px-1 mt-1">
                        {timeString}
                    </span>
                </div>
            </div>
        </div>
    )
}
