import { GitCommit, X, MessageSquare, Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function CommitModal({ isOpen, onClose, onConfirm, commitData, setCommitData, isSaving, saveError, saveSuccess }) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-6 backdrop-blur-[2px]"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSaving) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-(--card-bg) border border-(--main-border-color) w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 filter-none backdrop-filter-none"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-8 py-6 border-b border-(--main-border-color) flex justify-between items-center bg-(--card-bg-lighter)">
                    <div className="flex items-center gap-3">
                        <GitCommit />
                        <h3 className="font-bold text-lg">Commit Changes</h3>
                    </div>
                    <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity" disabled={isSaving}>
                        <X size={20} />
                    </button>
                </div>

                {/* Success State */}
                {saveSuccess && (
                    <div className="p-8 flex flex-col items-center gap-4 text-center">
                        <CheckCircle size={48} className="text-green-500" />
                        <p className="font-bold text-lg text-green-500">Changes Committed!</p>
                        <p className="text-sm opacity-60">Your changes have been pushed to GitHub.</p>
                    </div>
                )}

                {/* Form State */}
                {!saveSuccess && (
                    <>
                        <div className="p-8 flex flex-col gap-6">
                            {saveError && (
                                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                    <AlertCircle size={18} />
                                    {saveError}
                                </div>
                            )}

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold tracking-widest opacity-50 ml-1">
                                    Commit Message <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                                    <input
                                        type="text"
                                        value={commitData?.message || ''}
                                        onChange={(e) => setCommitData({ ...commitData, message: e.target.value })}
                                        className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-colors text-(--primary-text-color)"
                                        placeholder="Brief summary of changes"
                                        autoFocus
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-bold tracking-widest opacity-50 ml-1">
                                    Extended Description
                                </label>
                                <textarea
                                    value={commitData?.description || ''}
                                    onChange={(e) => setCommitData({ ...commitData, description: e.target.value })}
                                    className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl p-4 outline-none focus:border-blue-500/50 transition-colors resize-none h-24 text-sm text-(--primary-text-color)"
                                    placeholder="Add an optional extended description..."
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-(--card-bg-lighter) border-t border-(--main-border-color) flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 rounded-xl font-bold text-sm border border-(--main-border-color) hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isSaving}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-3 rounded-xl font-bold text-sm bg-(--active-text-color) text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 disabled:cursor-not-allowed flex items-center justify-center gap-2 visible flex ${(isSaving || !commitData.message?.trim()) ? 'opacity-70' : 'opacity-100'}`}
                                disabled={isSaving || !commitData.message?.trim()}
                                type="button"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Committing...
                                    </>
                                ) : (
                                    'Commit & Push'
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}