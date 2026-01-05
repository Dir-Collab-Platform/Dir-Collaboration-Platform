import { useContext } from 'react'
import { Code, Copy, Download, GitBranch } from "lucide-react"
import CodeToolBar from "./CodeToolBar"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext" 
import getRelativeTime from '../../../../utils/utils'

function MetaTagWithIcon({ icon, name }) {
    return (
        <span className="svg-btn flex gap-2 w-fit bg-(--meta-tag-color) text-(--secondary-text-color) h-fit px-2.5 py-0.5 rounded-2xl items-center">
            {icon && <span className="size-4 flex items-center justify-center">{icon}</span>}
            <p className="paragraph2 font-bold">{name}</p>
        </span>
    )
}

export default function CodeViewerHeader() {
    const context = useContext(WorkspaceContext)
    
    // Safety check for context
    if (!context) return null
    const { activeFile, repository, lastCommit } = context

    // Parse the path to show directory vs filename separately
    const pathParts = activeFile?.path?.split('/') || []
    const fileName = pathParts.pop() || 'NAF' // NAF = Not A File
    const dirPath = pathParts.length > 0 ? pathParts.join('/') + '/' : ''

    return (
        <div className="code-viewer-header flex flex-col gap-4">
            <div className="upper flex justify-between items-center">
                <div className="file-path-branch flex gap-4 items-center">
                    <h2 className="header2 font-semibold">
                        <span className="opacity-50">{repository?.name || 'Unknown-repository'}/</span>
                        <span className="opacity-50">{dirPath}</span>
                        <span className="text-(--active-text-color)">{fileName}</span>
                    </h2>
                    <MetaTagWithIcon 
                        icon={<GitBranch size={16} />} 
                        name={repository?.default_branch || 'main'} 
                    />
                </div>

                <CodeToolBar />
            </div>

            <div className="lower flex justify-between items-center pr-6 py-4 border-y border-(--main-border-color)">
                {
                    lastCommit?.commit?.message ?
                        <div className="last-commit flex gap-2 items-center paragraph2 text-(--secondary-text-color)">
                            Last commit 
                            <p className="font-extrabold text-(--primary-text-color)">
                                { lastCommit?.author?.login }
                            </p>
                            <p className="truncate max-w-50" title={lastCommit?.commit?.message}>
                                { lastCommit?.commit?.message ? `"${lastCommit?.commit?.message}"` : 'No message Found'}

                            </p>
                            <p className="font-mono text-xs opacity-60">
                                {lastCommit?.sha?.substring(0, 6)}
                            </p>
                            <p title={'Commited at: ' + lastCommit?.commit?.author?.date}>
                                <span className="font-extrabold text-(--primary-text-color)">
                                    {getRelativeTime(lastCommit?.commit?.author?.date)}
                                </span> ago
                            </p>
                        </div>
                        :
                        <div className='text-(--secondary-text-color) font-medium pl-6'>No commits Found!</div>
                }

                <div className="lower-tool-bar flex gap-4">
                    <button className="svg-btn icon-btn hover:text-(--active-text-color) transition-colors cursor-pointer">
                        <Download size={20} />
                    </button>

                    <button className="svg-btn icon-btn hover:text-(--active-text-color) transition-colors cursor-pointer">
                        <Copy size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}