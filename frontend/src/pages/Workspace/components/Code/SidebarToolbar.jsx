import { useState, useContext, useRef, useEffect } from 'react'
import { List, Pencil, Plus, Settings, X, GitCommit } from "lucide-react"
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'

function SidebarToggle() {
    const context = useContext(WorkspaceContext)
    if (!context) return null
    const { isSidebarOpen, setIsSidebarOpen } = context

    return (
        <button
            className="svg-btn icon-btn z-10"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
            <List />
        </button>
    )
}

function SettingsBtn({ isOpen }) {
    return (
        <button className={`svg-btn icon-btn transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
            <Settings />
        </button>
    )
}

function AddFileBtn({ isOpen, onAddFile }) {
    return (
        <button
            onClick={onAddFile}
            className={`svg-btn icon-btn transition-all duration-300 delay-75 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24 pointer-events-none'}`}
        >
            <Plus />
        </button>
    )
}

function EditFileBtn({ isOpen, activeFile = null }) {

    const context = useContext(WorkspaceContext)
    if (!context) return null
    const { isEditingFile, setIsEditingFile } = context

    function handleClick() {
        // should have some kind of popup letting the user know
        if (!activeFile) return null
        setIsEditingFile(!isEditingFile)
    }

    return (
        <button
            onClick={handleClick}
            className={`svg-btn icon-btn transition-all duration-300 delay-150 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-36 pointer-events-none'} ${isEditingFile ? 'text-blue-500 font-bold' : ''}`}
        >
            <Pencil />
        </button>
    )
}

// New file input component that appears in the file tree
function NewFileInput({ isVisible, onSubmit, onCancel, parentPath }) {
    const [fileName, setFileName] = useState('')
    const inputRef = useRef(null)

    useEffect(() => {
        if (isVisible && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isVisible])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (fileName.trim()) {
            onSubmit(fileName.trim(), parentPath)
            setFileName('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onCancel()
            setFileName('')
        }
    }

    if (!isVisible) return null

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-2 py-1 bg-(--secondary-button) rounded-lg">
            <input
                ref={inputRef}
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="filename.ext"
                className="flex-1 px-2 py-1 text-xs bg-transparent border-none outline-none text-(--primary-text-color) placeholder:text-(--secondary-text-color)"
            />
            <button type="submit" className="text-green-500 hover:text-green-400 p-1">
                <Plus size={14} />
            </button>
            <button type="button" onClick={onCancel} className="text-red-400 hover:text-red-300 p-1">
                <X size={14} />
            </button>
        </form>
    )
}

// Commit prompt banner
function CommitPrompt({ isVisible, onCommit, onDismiss, newFiles }) {
    if (!isVisible || newFiles.length === 0) return null

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-(--card-bg) border border-(--main-border-color) rounded-xl shadow-2xl p-4 z-50 flex items-center gap-4">
            <div className="flex items-center gap-2 text-(--primary-text-color)">
                <GitCommit size={18} />
                <span className="text-sm">
                    {newFiles.length} new file{newFiles.length > 1 ? 's' : ''} added
                </span>
            </div>
            <button
                onClick={onCommit}
                className="px-4 py-2 bg-(--primary-button) hover:bg-(--primary-button-hover) text-white rounded-lg text-xs font-bold"
            >
                Commit Changes
            </button>
            <button
                onClick={onDismiss}
                className="text-(--secondary-text-color) hover:text-(--primary-text-color)"
            >
                <X size={16} />
            </button>
        </div>
    )
}

export default function SidebarToolbar({ onShowNewFileInput, onShowCommitModal }) {
    const context = useContext(WorkspaceContext)

    if (!context) return null

    const { isSidebarOpen, activeFile } = context

    const handleAddFile = () => {
        // Trigger showing the new file input in the file tree
        onShowNewFileInput?.()
    }

    return (
        <div className={`flex items-center bg-(--card-bg-lighter) border border-(--main-border-color) px-6 py-3 transition-all duration-500 ease-in-out relative overflow-hidden
            ${isSidebarOpen ? 'rounded-tr-4xl pr-10 w-full' : 'rounded-xl pr-6 w-18'}
        `}>
            {/* The Toggle is the anchor */}
            <div className="flex items-center gap-10">
                <SidebarToggle />

                {/* The following buttons slide and fade behind the toggle */}
                <div className="flex items-center gap-10">
                    <SettingsBtn isOpen={isSidebarOpen} />
                    <AddFileBtn isOpen={isSidebarOpen} onAddFile={handleAddFile} />
                    <EditFileBtn isOpen={isSidebarOpen} activeFile={activeFile} />
                </div>
            </div>
        </div>
    )
}

// Export helper components for use in FileTree
export { NewFileInput, CommitPrompt }