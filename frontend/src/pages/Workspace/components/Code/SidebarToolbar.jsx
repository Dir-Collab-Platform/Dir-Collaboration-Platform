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

    const { isSidebarOpen, activeFile, initiateCreation } = context

    const handleAddFile = () => {
        // Determine target path based on active selection
        let targetPath = '';
        if (activeFile) {
            if (activeFile.type === 'dir') {
                targetPath = activeFile.path;
            } else {
                // Use parent folder of the active file
                const parts = activeFile.path.split('/');
                parts.pop();
                targetPath = parts.join('/');
            }
        }
        initiateCreation(targetPath);
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
export { CommitPrompt }