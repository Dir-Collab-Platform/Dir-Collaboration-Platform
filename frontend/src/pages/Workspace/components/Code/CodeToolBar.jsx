import { useState, useContext, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Code, GitBranch, GitCommit, Star, Trash2, Copy, Check, X } from "lucide-react"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"

function CommitBtn() {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <GitCommit />
            {/* to be replaced by real data */}
            <span className="text-(--secondary-text-color) text-bold">8</span>
        </button>
    )
}

function CloneBtn({ cloneUrl }) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const buttonRef = useRef(null)
    const popupRef = useRef(null)
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPopupPosition({
                top: rect.bottom + 8,
                left: rect.left
            })
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const handleCopy = () => {
        navigator.clipboard.writeText(cloneUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const popup = isOpen ? createPortal(
        <div
            ref={popupRef}
            style={{ top: popupPosition.top, left: popupPosition.left }}
            className="fixed w-80 bg-(--card-bg) border border-(--main-border-color) rounded-xl shadow-2xl p-4 z-[9999]"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-(--primary-text-color)">Clone Repository</h3>
                <button onClick={() => setIsOpen(false)} className="text-(--secondary-text-color) hover:text-(--primary-text-color)">
                    <X size={16} />
                </button>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    readOnly
                    value={cloneUrl}
                    className="flex-1 px-3 py-2 text-xs bg-(--secondary-button) border border-(--main-border-color) rounded-lg text-(--secondary-text-color) truncate"
                />
                <button
                    onClick={handleCopy}
                    className="px-3 py-2 bg-(--primary-button) hover:bg-(--primary-button-hover) text-white rounded-lg flex items-center gap-1 text-xs"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
        </div>,
        document.body
    ) : null

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="svg-btn icon-btn flex gap-2 items-center"
            >
                <Code />
            </button>
            {popup}
        </div>
    )
}

function BranchBtn({ branches = [], currentBranch, onBranchChange }) {
    const [isOpen, setIsOpen] = useState(false)
    const buttonRef = useRef(null)
    const popupRef = useRef(null)
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPopupPosition({
                top: rect.bottom + 8,
                left: rect.left
            })
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) &&
                buttonRef.current && !buttonRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isOpen])

    const handleBranchSelect = (branch) => {
        onBranchChange?.(branch)
        setIsOpen(false)
    }

    const popup = isOpen ? createPortal(
        <div
            ref={popupRef}
            style={{ top: popupPosition.top, left: popupPosition.left }}
            className="fixed w-56 bg-(--card-bg) border border-(--main-border-color) rounded-xl shadow-2xl overflow-hidden z-[9999]"
        >
            <div className="p-3 border-b border-(--main-border-color)">
                <h3 className="text-sm font-bold text-(--primary-text-color)">Switch Branch</h3>
            </div>
            <div className="max-h-48 overflow-y-auto scroll-bar">
                {branches.map((branch) => (
                    <button
                        key={branch}
                        onClick={() => handleBranchSelect(branch)}
                        className={`w-full px-4 py-2.5 text-left text-xs flex items-center gap-2 hover:bg-(--secondary-button-hover) transition-colors ${branch === currentBranch
                            ? 'bg-(--secondary-button) text-(--primary-text-color) font-bold'
                            : 'text-(--secondary-text-color)'
                            }`}
                    >
                        <GitBranch size={14} />
                        {branch}
                        {branch === currentBranch && <span className="ml-auto text-green-500">●</span>}
                    </button>
                ))}
            </div>
        </div>,
        document.body
    ) : null

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="svg-btn icon-btn flex gap-2 items-center"
            >
                <GitBranch />
                <span className="text-(--secondary-text-color) text-bold">{branches.length}</span>
            </button>
            {popup}
        </div>
    )
}

function StartBtn({ stars }) {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <Star />
            <span className="text-(--secondary-text-color) text-bold">{stars}</span>
        </button>
    )
}

function DeleteBtn({ activeFile, onDelete }) {
    const [isConfirming, setIsConfirming] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!activeFile) return;

        setIsDeleting(true);
        try {
            await onDelete(activeFile);
            setIsConfirming(false);
        } catch (error) {
            console.error(error);
            alert("Failed to delete file");
        } finally {
            setIsDeleting(false);
        }
    }

    if (isConfirming) {
        return (
            <div className="flex bg-(--secondary-button) rounded-lg border border-red-500/50 overflow-hidden animate-in zoom-in duration-200">
                <button
                    onClick={() => setIsConfirming(false)}
                    className="px-3 py-1 text-xs text-(--secondary-text-color) hover:bg-black/10 transition-colors"
                    disabled={isDeleting}
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    className="px-3 py-1 text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors flex items-center gap-2"
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className={`svg-btn icon-btn flex gap-2 items-center text-red-400 hover:text-red-500 hover:bg-red-500/10 ${!activeFile ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!activeFile}
            title={activeFile ? `Delete ${activeFile.name}` : "No file selected"}
        >
            <Trash2 size={16} />
        </button>
    )
}

export default function CodeToolBar() {
    const { repository, activeFile, deleteFile } = useContext(WorkspaceContext);
    const [currentBranch, setCurrentBranch] = useState(repository?.defaultBranch || 'main');

    // Mock branches - replace with real data from repository
    const branches = repository?.branches || ['main', 'develop', 'feature/auth', 'feature/ui'];
    const cloneUrl = repository?.cloneUrl || `https://github.com/${repository?.owner?.login || 'user'}/${repository?.name || 'repo'}.git`;

    const handleBranchChange = (branch) => {
        setCurrentBranch(branch);
        console.log(`Switched to branch: ${branch}`);
        // Future: call API to switch branch
    };

    return (
        <div className="flex gap-4 items-center bg-(--card-bg-lighter) border border-(--main-border-color) rounded-bl-full rounded-tr-2xl px-6 py-2">
            <CommitBtn />
            <div className="w-px h-6 bg-(--main-border-color)"></div>
            <CloneBtn cloneUrl={cloneUrl} />
            <BranchBtn
                branches={branches}
                currentBranch={currentBranch}
                onBranchChange={handleBranchChange}
            />
            <div className="w-px h-6 bg-(--main-border-color)"></div>
            <StartBtn stars={repository?.stargazers_count || 0} />
            <DeleteBtn activeFile={activeFile} onDelete={deleteFile} />
        </div>
    )
}