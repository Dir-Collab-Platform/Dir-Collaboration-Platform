
/**
 * Generic Confirmation Modal
 * Pops up in the center of the screen to ask a Yes/No question.
 */
export default function ConfirmationModal({ isOpen, onClose, onConfirm, question }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-(--card-bg) border border-(--main-border-color) rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform scale-100 transition-all">
                <h3 className="header2 font-bold text-(--primary-text-color) mb-2">Confirmation</h3>
                <p className="paragraph2 text-(--secondary-text-color) mb-6 leading-relaxed">
                    {question}
                </p>
                
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-xs font-medium text-(--secondary-text-color) bg-(--secondary-button) hover:bg-(--secondary-button-hover) transition-colors border border-transparent hover:border-(--main-border-color)"
                    >
                        No
                    </button>
                    <button 
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    )
}