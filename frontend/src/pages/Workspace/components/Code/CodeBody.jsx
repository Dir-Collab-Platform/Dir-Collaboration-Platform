import { useContext } from "react"
import CodeViewer from "./CodeViewer"
import CodeViewerHeader from "./CodeViewerHeader"
import CodeEditor from "./CodeEditor"
import ReadMe from "./ReadMe"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"

export default function CodeBody() {
    const context = useContext(WorkspaceContext)
    
    // Safety check for context
    if (!context) return null
    
    const { isEditingFile, activeFile } = context

    return (
        <div className="code-body flex flex-col gap-4 h-full pl-6 overflow-y-auto scroll-bar">
            <CodeViewerHeader />
            <div className="flex flex-col gap-8 pr-6 pb-10">
                {isEditingFile ? (
                    <CodeEditor activeFile={activeFile} />
                ) : (
                    <CodeViewer />
                )}
                <ReadMe />
            </div>
        </div>
    )
}