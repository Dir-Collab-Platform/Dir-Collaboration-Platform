import { useContext } from 'react'
import { ExternalLink } from "lucide-react"
import { GithubIcon } from "../../../../../public/assets/icons/icons"
import FileTree from "./FileTree"
import SidebarToolbar from "./SidebarToolbar"
import LanguageStatsBar from "./LanguageStatsBar"
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'

export default function RepoSidebar() {
    const context = useContext(WorkspaceContext)

    if (!context) return null
    const { repository } = context

    return (
        <div className="repo-sidebar h-full border-r border-(--main-border-color) rounded-tr-4xl flex flex-col overflow-hidden bg-(--card-bg)">
            {/* Header / Toolbar Area - Fixed at top */}
            <div className="shrink-0 z-10 bg-(--card-bg)">
                <SidebarToolbar />
            </div>

            {/* Unified Scrollable Area - Content + Footer */}
            <div className="flex-1 overflow-y-auto scroll-bar flex flex-col min-h-0">

                {/* File Tree - Grows naturally, pushes footer down */}
                <div className="flex-1 px-4 py-6">
                    <FileTree />
                </div>

                {/* Footer Area - Pushed to bottom of scrollable area */}
                <div className="shrink-0 flex flex-col gap-5 px-4 pb-6 pt-2 mt-auto">
                    <hr className="border-b border-(--main-border-color) opacity-30" />

                    <a href={repository?.html_url || ""} target="_blank" rel="noreferrer" className="w-full">
                        <button className="flex gap-4 bg-(--primary-button) py-2.5 px-6 rounded-xl text-(--button-text-color) items-center justify-center hover:bg-(--primary-button-hover) border border-(--main-border-color) cursor-pointer transition-all w-full font-bold shadow-sm active:scale-95">
                            <GithubIcon />
                            <span>GitHub</span>
                            <ExternalLink size={14} />
                        </button>
                    </a>

                    <LanguageStatsBar />
                </div>
            </div>
        </div>
    )
}