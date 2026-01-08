import { useState } from "react"
import { ChevronDown, Plus } from "lucide-react"
import Avatar from "./Avatar"



export function InviteBtn() {
    return (
        <button className="svg-btn primary-btn flex items-center gap-2 px-4 py-2 border border-(--main-border-color) rounded-2xl hover:bg-(--secondary-button-hover) transition-all">
            <Plus size={18} />
            <p className="paragraph2 font-bold">Invite members</p>
        </button>
    )
}

export function DropdownBtn({ isOpen, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`svg-btn icon-btn transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
            <ChevronDown />
        </button>
    )
}

export default function Collaborators({ members = [] }) {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="collaborators flex flex-col gap-4.5 bg-(--card-bg) border border-(--main-border-color) px-4 py-5 mt-8 rounded-2xl shadow-sm">
            <div className="collab-header flex justify-between items-center">
                <h1 className="header2 font-bold text-(--primary-text-color)">Collaborators</h1>
                <InviteBtn />
            </div>

            <div className="flex flex-col gap-2">
                <div className="collab-body flex justify-between items-center p-3 rounded-xl">
                    <div className="flex gap-3 items-center">
                        <div className="profiles flex -space-x-3">
                            {members.slice(0, 3).map((user) => (
                                <Avatar
                                    key={user.id}
                                    src={user.avatar}
                                    size={34}
                                    className="border-2 border-(--card-bg) ring-1 ring-(--main-border-color)"
                                />
                            ))}
                            {members.length > 3 && (
                                <div className="flex items-center justify-center size-8.5 rounded-full bg-(--secondary-button) border-2 border-(--card-bg) ring-1 ring-(--main-border-color) text-[10px] font-bold text-(--secondary-text-color)">
                                    +{members.length - 3}
                                </div>
                            )}
                        </div>
                        <p className="paragraph1 font-bold text-(--primary-text-color)">
                            {members.length} members
                        </p>
                    </div>

                    <DropdownBtn
                        isOpen={isExpanded}
                        onClick={() => setIsExpanded(!isExpanded)}
                    />
                </div>

                {/* Expanded Members List */}
                {isExpanded && (
                    <div className="expanded-list flex flex-col gap-2 p-2 animate-in slide-in-from-top-2 duration-200">
                        {members.map((user) => (
                            <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-(--card-bg-lighter) rounded-lg transition-colors group">
                                <Avatar src={user.avatar} size={28} />
                                <span className="paragraph2 text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors">
                                    {user.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}