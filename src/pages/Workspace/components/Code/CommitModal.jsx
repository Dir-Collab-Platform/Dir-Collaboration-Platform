import { GitCommit, X, MessageSquare } from "lucide-react"

export default function CommitModal({ isOpen, onClose, onConfirm, commitData, setCommitData }) {
    if (!isOpen) return null

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
            <div className="bg-(--card-bg) border border-(--main-border-color) w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-8 py-6 border-b border-(--main-border-color) flex justify-between items-center bg-(--card-bg-lighter)">
                    <div className="flex items-center gap-3">
                        <GitCommit />
                        <h3 className="font-bold text-lg">Commit Changes</h3>
                    </div>
                    <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-8 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold tracking-widest opacity-50 ml-1">
                            Commit Message
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                            <input 
                                type="text"
                                value={commitData.message}
                                onChange={(e) => setCommitData({...commitData, message: e.target.value})}
                                className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="Brief summary of changes"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold tracking-widest opacity-50 ml-1">
                            Extended Description
                        </label>
                        <textarea 
                            value={commitData.description}
                            onChange={(e) => setCommitData({...commitData, description: e.target.value})}
                            className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl p-4 outline-none focus:border-blue-500/50 transition-colors resize-none h-24 text-sm"
                            placeholder="Add an optional extended description..."
                        />
                    </div>
                </div>

                <div className="px-8 py-6 bg-(--card-bg-lighter) border-t border-(--main-border-color) flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl font-bold text-sm border border-(--main-border-color) hover:bg-black/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl font-bold text-sm bg-(--active-text-color) text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        Commit & Push
                    </button>
                </div>
            </div>
        </div>
    )
}