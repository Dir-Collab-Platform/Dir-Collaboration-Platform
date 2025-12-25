import ChannelList from "./Chat/ChannelList";
import Chat from "./Chat/Chat";
import ChatHeader from "./Chat/ChatHeader";
import Collaborators from "./Chat/Collaborators";

export default function ChatPanel() {
    return (
        <div className="chat-panel overflow-hidden bg-(--card-bg) border border-(--main-border-color) rounded-2xl">
            <ChannelList />

            <div className="chat-container">
                <ChatHeader name='core-team' notif_count={8} />
                <Chat />
            </div>

            <Collaborators />
        </div>
    )
}