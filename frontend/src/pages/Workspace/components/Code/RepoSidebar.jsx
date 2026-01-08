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
        <div className="repo-sidebar h-[calc(100vh - 4.66rem)] border-r border-(--main-border-color) rounded-tr-4xl">
            <SidebarToolbar />

            <div className="flex flex-col gap-8 px-6 py-8 overflow-y-scroll scroll-bar h-[calc(100vh-234px)]">
                <FileTree />

                <hr className="border-b border-(--main-border-color)" />

                <a href={repository?.html_url || ""} target="_blank" rel="noreferrer">
                    <button className="flex gap-6 bg-(--primary-button) py-4 px-8 m-auto rounded-2xl text-(--button-text-color) items-center hover:bg-(--primary-button-hover) border border-(--main-border-color) cursor-pointer transition-all">
                        <GithubIcon />
                        <span>GitHub</span>
                        <ExternalLink />
                    </button>
                </a>
                
                <LanguageStatsBar />
            </div>
        </div>
    )
}