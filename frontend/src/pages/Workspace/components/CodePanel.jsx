import { useContext } from 'react';
import RepoSidebar from "./Code/RepoSidebar";
import CodeBody from "./Code/CodeBody";
import { WorkspaceContext } from '../../../context/WorkspaceContext/WorkspaceContext';
import SidebarToolbar from './Code/SidebarToolbar';

export default function CodePanel() {
    const context = useContext(WorkspaceContext)
    
    if (!context) return null

    const { isSidebarOpen } = context

    return (
        <div className="flex grow overflow-hidden border border-(--main-border-color) rounded-2xl bg-(--card-bg)">
            {/* 1. File Explorer Sidebar Area */}
            <aside 
                className={`hidden md:flex flex-col rounded-tr-4xl border-r border-(--main-border-color) overflow-hidden shrink-0 transition-all duration-300
                    ${isSidebarOpen ? 'w-64 lg:w-72' : 'w-0 border-none'}
                `}
            >
                {/* Only show the full sidebar content when open */}
                {isSidebarOpen && <RepoSidebar />}
            </aside>

            {/* 2. Main Editor Area */}
            <section className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {!isSidebarOpen && (
                    <div className="p-2 border-b border-(--main-border-color)">
                        <SidebarToolbar />
                    </div>
                )}
                
                <CodeBody />
            </section>
        </div>
    )
}

