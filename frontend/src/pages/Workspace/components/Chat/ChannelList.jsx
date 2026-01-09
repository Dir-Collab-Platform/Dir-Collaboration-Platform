import { useContext, useState } from 'react'
import { Plus, X } from "lucide-react"
import { ChatContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import AddChannelModal from './AddChannelModal'

/**
 * ChannelTag Component
 */
function ChannelTag({ name, notif_count, isActive, onClick, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative flex items-center gap-2 px-2 py-1 rounded-lg cursor-pointer transition-all shrink-0 select-none pr-6
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

            {(isHovered || isActive) && (name !== 'general') && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className={`absolute right-1 p-0.5 rounded-full transition-colors ${isActive ? 'hover:bg-white/20' : 'hover:bg-black/10'}`}
                    title="Delete channel"
                >
                    <X size={12} className={isActive ? 'text-white' : 'text-(--secondary-text-color)'} />
                </button>
            )}
        </div>
    )
}

export default function ChannelList() {
    const chatContext = useContext(ChatContext)
    const [isModalOpen, setIsModalOpen] = useState(false)

    if (!chatContext) return null

    const { channels, activeChannelId, setActiveChannelId, users, deleteChannel } = chatContext

    const handleDeleteChannel = async (channelId, channelName) => {
        if (window.confirm(`Are you sure you want to delete #${channelName}? This action cannot be undone.`)) {
            try {
                if (deleteChannel) {
                    await deleteChannel(channelId);
                }
            } catch (err) {
                console.error('Failed to delete channel:', err);
                alert('Failed to delete channel');
            }
        }
    };

    return (
        <>
            <div className="relative flex items-center bg-(--dimmer-dark-bg) border-b border-(--main-border-color) w-full overflow-hidden h-12">

                {/* Left Gradient Overlay */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-(--dimmer-dark-bg) via-(--dimmer-dark-bg) to-transparent z-10 pointer-events-none" />

                {/* Scrollable container for Channel Tags */}
                <div className="channel-panel flex flex-1 gap-4 overflow-x-auto no-scrollbar pl-5.5 pr-14 items-center h-full">
                    {channels.map((channel) => {
                        const channelId = channel.channel_id || channel._id;
                        return (
                            <ChannelTag
                                key={channelId}
                                name={channel.name}
                                notif_count={channel.unreadCount || 0}
                                isActive={activeChannelId === channelId}
                                onClick={() => setActiveChannelId(channelId)}
                                onDelete={() => handleDeleteChannel(channelId, channel.name)}
                            />
                        );
                    })}
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