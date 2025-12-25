import { EllipsisVertical } from "lucide-react"

function MoreBtn() {
    return (
        <button className="svg-btn icon-btn">
            <EllipsisVertical />
        </button>
    )
}

export default function ChatHeader({ name, notif_count }) {
    return (
        <div className="chat-header flex justify-between items-center border-t border-(--main-border-color) py-2 px-2.5">
            <div className="name header2 flex items-center gap-2">
                <span className="text-(--channel-hash-color) font-bold">#</span>
                <p>{name}</p>
            </div>

            <div className="right-part flex gap-4">
                <div className="unread-msg flex gap-2 text-(--secondary-text-color)">
                    <span className="font-bold">{notif_count}</span>
                    <p className="paragraph-mini">unread messages</p>
                </div>

                <MoreBtn />
            </div>
        </div>
    )
}