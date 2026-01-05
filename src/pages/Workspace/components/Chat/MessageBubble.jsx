import { Smile } from "lucide-react"
import Avatar from "./Avatar"

export default function MessageBubble({ message, isCurrentUser }) {
    const timeString = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return (
        <div className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {!isCurrentUser && (
                <div className="shrink-0 mt-1">
                    <Avatar 
                        src={message.senderAvatar} 
                        size={32} 
                    />
                </div>
            )}
            
            <div className={`flex flex-col gap-1 max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                <div className="relative group">
                    <div className={`px-4 py-2 rounded-2xl text-[13px] leading-relaxed shadow-sm
                        ${isCurrentUser 
                            ? 'bg-(--sent-message) rounded-br-none text-(--primary-text-color)' 
                            : 'bg-(--received-message) rounded-bl-none text-(--primary-text-color)'}
                    `}>
                        {/* the sender's name if the sender is not the current user */}
                        {!isCurrentUser &&
                            <div className="font-semibold text-xs text-(--secondary-text-color)">
                                {message.senderName}
                            </div>
                        }

                        {message.content}

                    </div>

                    {/* Reactions Display (Figma Style) */}
                    {message.reactions && message.reactions.length > 0 && (
                        <div className={`flex flex-wrap gap-1 mt-1.5 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            {message.reactions.map((reaction, idx) => (
                                <button 
                                    key={idx} 
                                    className="flex items-center gap-1.5 bg-(--card-bg-lighter) border border-(--main-border-color) rounded-full px-2 py-0.5 text-[10px] hover:border-(--active-text-color) transition-colors"
                                >
                                    <span>{reaction.emoji}</span>
                                    <span className="text-(--secondary-text-color) font-medium">1</span>
                                </button>
                            ))}
                            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-(--secondary-button-hover) rounded-full transition-all text-(--secondary-text-color)">
                                <Smile size={12} />
                            </button>
                        </div>
                    )}
                </div>
                
                <span className="text-[10px] text-(--secondary-text-color) opacity-60 font-mono px-1">
                    {timeString}
                </span>
            </div>
        </div>
    )
}
