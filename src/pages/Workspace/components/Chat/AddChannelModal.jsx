import { useState } from "react"
import { X, Globe, Lock, ChevronDown, Plus } from 'lucide-react'

export default function AddChannelModal({ isOpen, onClose, users = [] }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('')
    const [type, setType] = useState('public') // 'public' or 'restricted'
    const [selectedMembers, setSelectedMembers] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    if (!isOpen) return null

    const toggleMember = (userId) => {
        setSelectedMembers(
            selectedMembers.includes(userId) ? selectedMembers.filter(id => id !== userId) : [...selectedMembers, userId]
        )
    }

    const handleNext = () => {
        setIsLoading(true);
        // Simulate backend processing
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 1000); // 1 second delay
    };

    const handleSubmit = () => {
        console.log({ name, type, selectedMembers })
        onClose()
        // Reset state after closing
        setTimeout(() => {
            setStep(1);
            setName('');
            setType('public');
            setSelectedMembers([]);
        }, 300);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <div className="bg-(--card-bg) border border-(--main-border-color) rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-(--main-border-color)">
                    <h3 className="text-lg font-bold text-(--primary-text-color)">
                        {step === 1 ? 'Create a channel' : 'Channel Settings'}
                    </h3>
                    <button onClick={onClose} className="text-(--secondary-text-color) hover:text-(--primary-text-color)">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar min-h-[200px]">
                    {step === 1 && (
                        /* Step 1: Channel Name */
                        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="text-[10px] font-bold tracking-widest text-(--secondary-text-color) opacity-60">
                                CHANNEL NAME
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--secondary-text-color) font-bold">#</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. project-x"
                                    autoFocus
                                    className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl py-2.5 pl-8 pr-4 text-xs text-(--primary-text-color) outline-none focus:border-(--active-text-color) transition-all"
                                />
                            </div>
                            <p className="text-[10px] text-(--secondary-text-color)">
                                Channels are where your team communicates. They’re best when organized around a topic — #marketing, for example.
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        /* Loading State */
                        <div className="flex flex-col items-center justify-center h-40 gap-4 animate-in fade-in zoom-in-95 duration-300">
                            <div className="size-8 rounded-full border-2 border-(--active-text-color) border-t-transparent animate-spin" />
                            <p className="text-xs font-medium text-(--secondary-text-color)">Processing channel details...</p>
                        </div>
                    )}

                    {step === 2 && !isLoading && (
                        /* Step 2: Visibility & Members */
                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold tracking-widest text-(--secondary-text-color) opacity-60">
                                    VISIBILITY
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setType('public')}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                                            ${type === 'public' ? 'border-(--active-text-color) bg-(--active-text-color)/5' : 'border-(--main-border-color) hover:bg-(--secondary-button-hover)'}
                                        `}
                                    >
                                        <Globe size={18} className={type === 'public' ? 'text-(--active-text-color)' : 'text-(--secondary-text-color)'} />
                                        <div>
                                            <p className="text-xs font-bold text-(--primary-text-color)">Public</p>
                                            <p className="text-[10px] text-(--secondary-text-color) leading-tight">Everyone can join</p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setType('restricted')}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left
                                            ${type === 'restricted' ? 'border-(--active-text-color) bg-(--active-text-color)/5' : 'border-(--main-border-color) hover:bg-(--secondary-button-hover)'}
                                        `}
                                    >
                                        <Lock size={18} className={type === 'restricted' ? 'text-(--active-text-color)' : 'text-(--secondary-text-color)'} />
                                        <div>
                                            <p className="text-xs font-bold text-(--primary-text-color)">Restricted</p>
                                            <p className="text-[10px] text-(--secondary-text-color) leading-tight">Private members only</p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Members Selection */}
                            {type === 'restricted' && (
                                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="text-[10px] font-bold tracking-widest text-(--secondary-text-color) opacity-60">
                                        ADMIT MEMBERS
                                    </label>
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="w-full flex items-center justify-between bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl py-2.5 px-4 text-xs text-(--secondary-text-color)"
                                        >
                                            <span className="truncate">
                                                {selectedMembers.length > 0
                                                    ? `${selectedMembers.length} members selected`
                                                    : "Select people..."
                                                }
                                            </span>
                                            <ChevronDown size={14} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-(--card-bg) border border-(--main-border-color) rounded-xl shadow-2xl z-10 max-h-40 overflow-y-auto custom-scrollbar">
                                                {users && users.map(user => (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => toggleMember(user._id)}
                                                        className="flex items-center justify-between px-4 py-2 hover:bg-(--secondary-button-hover) cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="size-5 rounded-full bg-(--secondary-button-hover) flex items-center justify-center text-[10px] font-bold text-(--secondary-text-color) overflow-hidden border border-(--main-border-color)">
                                                                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-full object-cover" /> : (user.githubUsername?.charAt(0).toUpperCase() || '?')}
                                                            </div>
                                                            <span className="text-xs text-(--primary-text-color)">{user.githubUsername}</span>
                                                        </div>
                                                        <div className={`size-4 rounded border flex items-center justify-center transition-colors
                                                            ${selectedMembers.includes(user._id) ? 'bg-(--active-text-color) border-(--active-text-color)' : 'border-(--main-border-color)'}
                                                        `}>
                                                            {selectedMembers.includes(user._id) && <X size={12} className="text-white" />}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-(--main-border-color) flex justify-between gap-3 bg-(--card-bg-lighter)/30">
                    <div className="flex gap-2">
                        {/* Only show dots if not loading */}
                        {!isLoading && (
                            <>
                                <div className={`size-2 rounded-full transition-colors ${step === 1 ? 'bg-(--active-text-color)' : 'bg-(--secondary-button-hover)'}`} />
                                <div className={`size-2 rounded-full transition-colors ${step === 2 ? 'bg-(--active-text-color)' : 'bg-(--secondary-button-hover)'}`} />
                            </>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs font-semibold text-(--secondary-text-color) hover:text-(--primary-text-color) transition-colors"
                        >
                            Cancel
                        </button>

                        {step === 1 && (
                            <button
                                onClick={handleNext}
                                disabled={!name || isLoading}
                                className="bg-(--primary-button) text-(--button-text-color) px-6 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Processing...' : 'Next'}
                            </button>
                        )}

                        {step === 2 && !isLoading && (
                            <button
                                onClick={handleSubmit}
                                className="bg-(--primary-button) text-(--button-text-color) px-6 py-2 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all"
                            >
                                Create Channel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
