import React, { useState, useEffect, useContext, useMemo } from "react"
import { Save, RotateCcw, X, Loader2 } from "lucide-react"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import { apiRequest } from "../../../../services/api/api"
import CommitModal from "./CommitModal"

export default function CodeEditor({ activeFile }) {
    const context = useContext(WorkspaceContext)

    if (!context) return null

    const { setIsEditingFile, repository } = context
    const [code, setCode] = useState("")
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState(null)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [commitData, setCommitData] = useState({
        message: "",
        description: ""
    })

    const rawContent = useMemo(function () {
        if (!activeFile?.content) return ""
        return activeFile.content
    }, [activeFile])

    useEffect(function () {
        if (activeFile?.content) {
            setCode(rawContent)
        }
    }, [activeFile, rawContent])

    function handleOpenCommit() {
        setCommitData({
            message: `Update ${activeFile?.name || 'file'}`,
            description: ""
        })
        setSaveError(null)
        setIsCommitModalOpen(true)
    }

    // Real API call to commit changes to GitHub via backend
    async function handleFinalSave() {
        if (!repository?._id || !activeFile?.path || !activeFile?.sha) {
            setSaveError("Missing required data for commit");
            return;
        }

        setIsSaving(true);
        setSaveError(null);

        try {
            const response = await apiRequest(`/api/repos/${repository._id}/contents`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    path: activeFile.path,
                    content: code,
                    sha: activeFile.sha,
                    commitMessage: commitData.message + (commitData.description ? `\n\n${commitData.description}` : '')
                })
            });

            if (response.status === 'success') {
                setSaveSuccess(true);
                setTimeout(() => {
                    setSaveSuccess(false);
                    setIsCommitModalOpen(false);
                    setIsEditingFile(false);
                }, 1500);
            } else {
                setSaveError(response.message || 'Failed to save file');
            }
        } catch (err) {
            setSaveError(err.message || 'Failed to commit changes');
        } finally {
            setIsSaving(false);
        }
    }

    function handleReset() {
        if (activeFile?.content) {
            setCode(rawContent)
        }
    }

    function handleExit() {
        setIsEditingFile(false)
    }

    return (
        <div className="flex flex-col gap-4 w-full h-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-2xl overflow-hidden shadow-sm relative filter-none backdrop-filter-none opacity-100">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-(--main-border-color) bg-(--card-bg)">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-sm font-medium opacity-80 tracking-wider">
                        Editing: {activeFile?.name || "Untitled"}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={handleReset}
                        className="svg-btn icon-btn"
                        title="Reset to original"
                    >
                        <RotateCcw size={14} />
                    </button>

                    <button
                        onClick={handleOpenCommit}
                        className="svg-btn icon-btn"
                        title="Save and commit changes"
                    >
                        <Save size={14} />
                    </button>

                    <button
                        onClick={handleExit}
                        className="text-red-600 svg-btn icon-btn"
                        title="Exit without saving"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Textarea Editor */}
            <div className="relative flex-1 p-0 m-0 overflow-hidden bg-(--card-bg-lighter)">
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-8 font-mono text-sm leading-relaxed resize-none outline-none bg-transparent scroll-bar text-(--primary-text-color) opacity-100 filter-none"
                    spellCheck="false"
                    placeholder="Enter your code here..."
                />
            </div>

            {/* Editor Footer Info */}
            <div className="px-6 py-2 border-t border-(--main-border-color) bg-(--card-bg) flex justify-between items-center opacity-60">
                <span className="text-[10px] font-bold tracking-widest">
                    {activeFile?.name?.split('.').pop()?.toLowerCase() || "plain text"}
                </span>
                <span className="text-[10px] font-medium">
                    {code.length} characters
                </span>
            </div>

            <CommitModal
                isOpen={isCommitModalOpen}
                onClose={() => setIsCommitModalOpen(false)}
                onConfirm={handleFinalSave}
                commitData={commitData}
                setCommitData={setCommitData}
                isSaving={isSaving}
                saveError={saveError}
                saveSuccess={saveSuccess}
            />
        </div>
    )
}