import { useContext } from 'react'
import { List, Pencil, Plus, Settings } from "lucide-react"
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

function SettingsBtn({isOpen}) {
    return (
        <button className={`svg-btn icon-btn transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
            <Settings />
        </button>
    )
}

function AddFileBtn({ isOpen  }) {
    return (
        <button className={`svg-btn icon-btn transition-all duration-300 delay-75 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-24 pointer-events-none'}`}>
            <Plus />
        </button>
    )
}

function EditFileBtn({ isOpen, activeFile=null }) {
    
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

export default function SidebarToolbar() {
    const context = useContext(WorkspaceContext)

    if (!context) return null

    const { isSidebarOpen, activeFile } = context

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
                    <AddFileBtn isOpen={isSidebarOpen} />
                    <EditFileBtn isOpen={isSidebarOpen} activeFile={activeFile} />
                </div>
            </div>
        </div>
    )
}