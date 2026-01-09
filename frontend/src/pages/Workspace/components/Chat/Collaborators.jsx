import { useState, useContext, useRef, useEffect } from "react"
import { ChevronDown, Plus, X, UserPlus, Trash2, Loader2 } from "lucide-react"
import Avatar from "./Avatar"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"

export function InviteBtn() {
    const { inviteMember } = useContext(WorkspaceContext);
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const popupRef = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) &&
                btnRef.current && !btnRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInvite = async () => {
        if (!username.trim()) return;
        setIsLoading(true);
        try {
            await inviteMember(username);
            setUsername("");
            setIsOpen(false);
        } catch (error) {
            alert("Failed to invite member: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                ref={btnRef}
                onClick={() => setIsOpen(!isOpen)}
                className="svg-btn primary-btn flex items-center gap-2 px-4 py-2 border border-(--main-border-color) rounded-2xl hover:bg-(--secondary-button-hover) transition-all"
            >
                <Plus size={18} />
                <p className="paragraph2 font-bold">Invite members</p>
            </button>

            {isOpen && (
                <div
                    ref={popupRef}
                    className="absolute right-0 top-full mt-2 w-64 bg-(--card-bg) border border-(--main-border-color) rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200"
                >
                    <h3 className="text-sm font-bold mb-3 text-(--primary-text-color)">Invite to Workspace</h3>
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="GitHub username"
                            className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                        <button
                            onClick={handleInvite}
                            disabled={isLoading || !username.trim()}
                            className="w-full bg-(--active-text-color) text-white rounded-lg py-2 text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={12} className="animate-spin" /> : <UserPlus size={14} />}
                            Send Invite
                        </button>
                    </div>
                </div>
            )}
        </div>
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
    const { removeMember } = useContext(WorkspaceContext);

    const handleRemove = async (userId, userName) => {
        if (window.confirm(`Remove ${userName} from workspace?`)) {
            try {
                await removeMember(userId);
            } catch (error) {
                alert("Failed to remove member");
            }
        }
    };

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
                            {members.slice(0, 3).map((member, idx) => {
                                // Handle populated vs non-populated userId
                                const user = member.userId || member;
                                return (
                                    <Avatar
                                        key={user._id || idx}
                                        src={user.avatarUrl}
                                        size={34}
                                        className="border-2 border-(--card-bg) ring-1 ring-(--main-border-color)"
                                    />
                                );
                            })}
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
                        {members.map((member, idx) => {
                            const user = member.userId || member;
                            const userId = user._id || user.id;
                            const userName = user.githubUsername || user.name || 'Unknown';

                            return (
                                <div key={userId || idx} className="flex justify-between items-center p-2 hover:bg-(--card-bg-lighter) rounded-lg transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={user.avatarUrl} size={28} />
                                        <div className="flex flex-col">
                                            <span className="paragraph2 text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors">
                                                {userName}
                                            </span>
                                            <span className="text-[10px] opacity-50 capitalize">{member.role || 'Member'}</span>
                                        </div>
                                    </div>
                                    {/* Only show delete button for non-owners or based on permissions (simplified here) */}
                                    <button
                                        onClick={() => handleRemove(userId, userName)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                                        title="Remove member"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}