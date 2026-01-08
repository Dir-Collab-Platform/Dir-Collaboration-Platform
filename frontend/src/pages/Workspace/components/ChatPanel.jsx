// import ChannelList from "./Chat/ChannelList";
// import Chat from "./Chat/Chat";
// import ChatHeader from "./Chat/ChatHeader";
// import Collaborators from "./Chat/Collaborators";

// export default function ChatPanel() {
//     return (
//         <div className="chat-panel overflow-hidden bg-(--card-bg) border border-(--main-border-color) rounded-2xl h-[calc(100vh-180px)]">
//             <ChannelList />

//             <div className="chat-container">
//                 <ChatHeader name='core-team' notif_count={8} />
//                 <Chat />
//             </div>

//             <Collaborators />
//         </div>
//     )
// }

import { useContext } from 'react'
import ChannelList from "./Chat/ChannelList"
import Chat from "./Chat/Chat"
import ChatHeader from "./Chat/ChatHeader"
import Collaborators from "./Chat/Collaborators"
import { ChatContext, WorkspaceContext } from '../../../context/WorkspaceContext/WorkspaceContext'

/**
 * ChatPanel Component
 * Follows the Figma layout: Channel list on the left, main chat area on the right.
 * Integrated with ChatContext for dynamic notification and channel data.
 */
export default function ChatPanel() {
    const chatContext = useContext(ChatContext)
    const { repository } = useContext(WorkspaceContext)

    if (!chatContext) {
        return (
            <div className="flex grow items-center justify-center bg-(--card-bg) border border-(--main-border-color) rounded-2xl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-(--active-text-color) border-t-transparent rounded-full animate-spin"></div>
                    <p className="paragraph2 text-(--secondary-text-color)">Connecting to workspace...</p>
                </div>
            </div>
        )
    }

    const { activeChannel, isLoading, error, messages } = chatContext

    // Dynamically calculate notification count for the active channel based on message history
    const activeChannelMessages = messages?.filter(m => m.channelId === activeChannel?._id) || []
    // this should be changed to the number of messages the user have not seen yet
    const notifCount = activeChannelMessages.length

    if (isLoading) {
        return (
            <div className="flex grow items-center justify-center bg-(--card-bg) border border-(--main-border-color) rounded-2xl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-(--active-text-color) border-t-transparent rounded-full animate-spin"></div>
                    <p className="paragraph2 text-(--secondary-text-color)">Syncing messages...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex grow items-center justify-center bg-(--card-bg) border border-(--main-border-color) rounded-2xl p-6 text-center">
                <p className="paragraph2 text-(--secondary-text-color)">{error}</p>
            </div>
        )
    }

    return (
        <div className="chat-panel relative flex flex-col h-full overflow-y-auto scroll-bar bg-(--card-bg) border border-(--main-border-color) rounded-2xl shadow-2xl">
            {/* Left Column: Channel Navigation (Top Bar) */}
            <nav className="sticky top-0 z-10 shrink-0 w-full border-r border-(--main-border-color) bg-(--dimmer-dark-bg)">
                <ChannelList />
            </nav>

            {/* Main Column: Chat Area (Occupies remaining width per Figma) */}
            <section className="flex flex-col grow min-w-0">
                <ChatHeader
                    name={activeChannel?.name || 'Select channel'}
                    notif_count={notifCount}
                />

                <div className="chat-container grow overflow-hidden">
                    <Chat />
                </div>

                <Collaborators members={repository?.members} />
            </section>

        </div>

    )
}