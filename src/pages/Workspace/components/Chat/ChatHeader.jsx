import { useState, useRef, useEffect } from 'react'
import { EllipsisVertical, Trash2, CheckCircle2, Eraser, LogOut } from "lucide-react"
import ConfirmationModal from '../../../../common-components/ConfirmationModal'


function MoreBtn({ onClick }) {
    return (
        <button onClick={onClick} className="svg-btn icon-btn">
            <EllipsisVertical />
        </button>
    )
}

function MenuPopup({ isOpen, onClose, onDeleteRequest, onLeaveRequest }) {
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            ref={menuRef}
            className="absolute z-50 right-0 top-full mt-2 w-48 bg-(--card-bg) border border-(--main-border-color) rounded-xl shadow-xl overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-100"
        >
            <div className="flex flex-col py-1">
                <button
                    onClick={() => { console.log('Mark read'); onClose() }}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors text-left"
                >
                    <CheckCircle2 size={14} />
                    <span>Mark all as read</span>
                </button>

                <button
                    onClick={() => { console.log('Clear messages'); onClose() }}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors text-left"
                >
                    <Eraser size={14} />
                    <span>Clear messages</span>
                </button>

                <button
                    onClick={() => {
                        onClose()
                        onLeaveRequest()
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors text-left"
                >
                    <LogOut size={14} />
                    <span>Leave channel</span>
                </button>

                <div className="h-px bg-(--main-border-color) my-1 mx-2" />

                <button
                    onClick={() => {
                        onClose()
                        onDeleteRequest()
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-(--secondary-button-hover) hover:text-red-300 transition-colors text-left"
                >
                    <Trash2 size={14} />
                    <span>Delete channel</span>
                </button>
            </div>
        </div>
    )
}

export default function ChatHeader({ name, notif_count }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

    // Function to execute when user confirms delete
    const handleDeleteChannel = () => {
        console.log(`Channel #${name} deleted`)
        // Future logic: call API to delete channel
    }

    // Function to execute when user confirms leave
    const handleLeaveChannel = () => {
        console.log(`Left channel #${name}`)
        // Future logic: call API to leave channel
    }

    return (
        <>
            <div className="chat-header flex justify-between items-center border-t border-(--main-border-color) py-2 px-2.5 bg-(--card-bg) relative">
                <div className="name header2 flex items-center gap-2">
                    <span className="text-(--channel-hash-color) font-bold">#</span>
                    <p>{name}</p>
                </div>

                <div className="right-part flex gap-4 items-center relative">
                    {notif_count > 0 && (
                        <div className="unread-msg flex gap-2 text-(--secondary-text-color)">
                            <span className="font-bold">{notif_count}</span>
                            <p className="paragraph-mini">unread messages</p>
                        </div>
                    )}

                    <div className="relative">
                        <MoreBtn onClick={() => setIsMenuOpen(!isMenuOpen)} />

                        <MenuPopup
                            isOpen={isMenuOpen}
                            onClose={() => setIsMenuOpen(false)}
                            onDeleteRequest={() => setIsDeleteModalOpen(true)}
                            onLeaveRequest={() => setIsLeaveModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Delete confirmation modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteChannel}
                question={`Are you sure you want to delete the channel #${name}? This action cannot be undone.`}
            />

            {/* Leave confirmation modal */}
            <ConfirmationModal
                isOpen={isLeaveModalOpen}
                onClose={() => setIsLeaveModalOpen(false)}
                onConfirm={handleLeaveChannel}
                question={`Are you sure you want to leave the channel #${name}?`}
            />
        </>
    )
}