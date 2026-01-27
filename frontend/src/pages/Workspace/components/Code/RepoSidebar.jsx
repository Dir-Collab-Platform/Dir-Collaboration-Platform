import { useContext, useState } from 'react'
import { ExternalLink } from "lucide-react"
import { GithubIcon } from "../../../../../public/assets/icons/icons"
import FileTree from "./FileTree"
import SidebarToolbar, { CommitPrompt } from "./SidebarToolbar"
import LanguageStatsBar from "./LanguageStatsBar"
import CommitModal from "./CommitModal"
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'

export default function RepoSidebar() {
    const context = useContext(WorkspaceContext)
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)
    const [commitData, setCommitData] = useState({ message: '', description: '' })
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [saveError, setSaveError] = useState(null)

    if (!context) return null
    const { repository, stagedFiles, commitChanges, isLoadingFile } = context

    const handleCommit = async () => {
        const fullMessage = commitData.description
            ? `${commitData.message}\n\n${commitData.description}`
            : commitData.message;

        setSaveError(null);
        try {
            const success = await commitChanges(fullMessage);
            if (success) {
                setSaveSuccess(true);
                setTimeout(() => {
                    setSaveSuccess(false);
                    setIsCommitModalOpen(false);
                    setCommitData({ message: '', description: '' });
                }, 1500);
            }
        } catch (err) {
            setSaveError(err.message || 'Failed to commit changes');
        }
    }

    return (
        <div className="repo-sidebar h-full border-r border-(--main-border-color) rounded-tr-4xl flex flex-col overflow-hidden bg-(--card-bg) relative">
            {/* Header / Toolbar Area - Fixed at top */}
            <div className="shrink-0 z-10 bg-(--card-bg)">
                <SidebarToolbar />
            </div>

            {/* Unified Scrollable Area - Content + Footer */}
            <div className="flex-1 overflow-y-auto scroll-bar flex flex-col min-h-0">

                {/* File Tree - Grows naturally */}
                <div className="flex-1 px-4 py-6">
                    <FileTree />
                </div>

                {/* Footer Area */}
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

            {/* Commit Prompt Overlay (Triggers Modal) */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-full px-4">
                <CommitPrompt
                    isVisible={stagedFiles?.length > 0}
                    newFiles={stagedFiles || []}
                    onCommit={() => setIsCommitModalOpen(true)}
                    onDismiss={() => { }}
                />
            </div>

            {/* Actual Commit Modal */}
            <CommitModal
                isOpen={isCommitModalOpen}
                onClose={() => setIsCommitModalOpen(false)}
                onConfirm={handleCommit}
                commitData={commitData}
                setCommitData={setCommitData}
                isSaving={isLoadingFile}
                saveSuccess={saveSuccess}
                saveError={saveError}
            />
        </div>
    )
}