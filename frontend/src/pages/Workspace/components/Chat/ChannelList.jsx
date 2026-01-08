import { useContext, useState } from 'react'
import { Plus } from "lucide-react"
import { ChatContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import AddChannelModal from './AddChannelModal'

/**
 * ChannelTag Component
 */
function ChannelTag({ name, notif_count, isActive, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`relative flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all shrink-0 select-none
                ${isActive 
                    ? 'bg-(--active-text-color) text-white' 
                    : 'bg-(--meta-tag-color) text-(--secondary-text-color) hover:brightness-110'}
            `}
        >
            <span className={`font-bold ${isActive ? 'text-white/70' : 'text-(--channel-hash-color)'}`}>
                #
            </span>
            <p className="text-xs font-semibold">{name}</p>
            {
                notif_count > 0 && 
                <span className="notif-count flex items-center justify-center text-[10px] font-bold absolute -top-1.5 -right-1.5 bg-(--notification-count-bg) text-white size-5 rounded-full border-2 border-(--dimmer-dark-bg) shadow-sm">
                    {notif_count}
                </span>
            }
        </div>
    )
}

export default function ChannelList() {
    const chatContext = useContext(ChatContext)
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!chatContext) return null
    
    // const channels = chatContext?.channels || []
    // const activeChannelId = chatContext?.activeChannelId
    // const setActiveChannelId = chatContext?.setActiveChannelId || (() => {})
    // const users = chatContext?.users || []

    const { channels, activeChannelId, setActiveChannelId, users } = chatContext

    return (
        <>
            <div className="relative flex items-center bg-(--dimmer-dark-bg) border-b border-(--main-border-color) w-full overflow-hidden h-12">
                
                {/* Left Gradient Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-(--dimmer-dark-bg) via-(--dimmer-dark-bg) to-transparent z-10 pointer-events-none" />

                {/* Scrollable container for Channel Tags */}
                <div className="channel-panel flex flex-1 gap-4 overflow-x-auto no-scrollbar pl-5.5 pr-14 items-center h-full">
                    {channels.map((channel) => (
                        <ChannelTag 
                            key={channel._id}
                            name={channel.name} 
                            notif_count={channel.unreadCount || 0}
                            isActive={activeChannelId === channel._id}
                            onClick={() => setActiveChannelId(channel._id)}
                        />
                    ))}
                </div>

                {/* Right Gradient & Sticky Add Channel Button */}
                <div className="absolute top-0 right-0 flex items-center h-full pl-10 pr-2 bg-linear-to-l from-(--dimmer-dark-bg) via-(--dimmer-dark-bg) to-transparent z-20">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center p-1.5 rounded-md bg-(--meta-tag-color) text-(--secondary-text-color) hover:bg-(--active-text-color) hover:text-white transition-all shadow-sm active:scale-90"
                        aria-label="Add Channel"
                    >
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>

            <AddChannelModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                users={users}
            />
        </>
    )
}