import React, { useState, useEffect, useContext, useMemo } from "react"
import { Save, RotateCcw, X } from "lucide-react"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
// import { decodeFileContent } from "../../../../utils/utils"
import CommitModal from "./CommitModal"

export default function CodeEditor({ activeFile }) {
    const context = useContext(WorkspaceContext)

    if (!context) return null

    const { setIsEditingFile } = context
    const [code, setCode] = useState("")
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false)
    const [commitData, setCommitData] = useState({
        message: "",
        description: ""
    })

    const rawContent = useMemo(function () {
        if (!activeFile?.content) return ""
        // return decodeFileContent(activeFile.content, activeFile.encoding)
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
        setIsCommitModalOpen(true)
    }

    // to be replaced with push logic to github/ backend
    function handleFinalSave() {
        console.log("Committing changes for:", activeFile?.name)
        console.log("Commit Message:", commitData.message)
        console.log("Description:", commitData.description)
        console.log("Code:", code)

        setIsCommitModalOpen(false)
        setIsEditingFile(false)
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
        <div className="flex flex-col gap-4 w-full h-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-2xl overflow-hidden shadow-sm relative">
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
                    className="w-full h-full p-8 font-mono text-sm leading-relaxed resize-none outline-none bg-transparent scroll-bar"
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
            />
        </div>
    )
}