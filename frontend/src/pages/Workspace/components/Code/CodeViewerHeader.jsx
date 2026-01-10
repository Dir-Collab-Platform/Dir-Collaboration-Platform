import { useContext } from 'react'
import { Code, Copy, Download, GitBranch } from "lucide-react"
import CodeToolBar from "./CodeToolBar"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import { getRelativeTime } from '../../../../utils/utils'

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
            <div className="upper flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="file-path-branch flex gap-3 items-center min-w-0 w-full sm:w-auto">
                    <h2 className="header2 font-semibold truncate flex min-w-0" title={`${repository?.name}/${dirPath}${fileName}`}>
                        <span className="opacity-50 truncate-start max-w-[150px] md:max-w-[300px] shrink">
                            {repository?.name || 'Unknown'}/{dirPath}
                        </span>
                        <span className="text-(--text-active) shrink-0 ml-1">{fileName}</span>
                    </h2>
                    <div className="shrink-0 hidden xs:block">
                        <MetaTagWithIcon
                            icon={<GitBranch size={16} />}
                            name={repository?.default_branch || 'main'}
                        />
                    </div>
                </div>

                <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
                    <CodeToolBar />
                </div>
            </div>

            <div className="lower flex flex-col lg:flex-row justify-between items-start lg:items-center pr-6 py-4 border-y border-(--main-border-color) gap-4">
                {
                    lastCommit?.commit?.message ?
                        <div className="last-commit flex flex-wrap gap-2 items-center paragraph2 text-(--secondary-text-color)">
                            <span className="shrink-0">Last commit</span>
                            <p className="font-extrabold text-(--text-primary) shrink-0">
                                {lastCommit?.author?.login}
                            </p>
                            <p className="truncate max-w-[200px] sm:max-w-[400px]" title={lastCommit?.commit?.message}>
                                {lastCommit?.commit?.message ? `"${lastCommit?.commit?.message}"` : 'No message Found'}
                            </p>
                            <div className="flex gap-2 items-center shrink-0">
                                <p className="font-mono text-[10px] opacity-60 bg-(--bg-dim) px-1.5 py-0.5 rounded">
                                    {lastCommit?.sha?.substring(0, 6)}
                                </p>
                                <p className="text-sm" title={'Commited at: ' + lastCommit?.commit?.author?.date}>
                                    <span className="font-extrabold text-(--text-primary)">
                                        {getRelativeTime(lastCommit?.commit?.author?.date)}
                                    </span> ago
                                </p>
                            </div>
                        </div>
                        :
                        <div className='text-(--secondary-text-color) font-medium'>No commits Found!</div>
                }

                <div className="lower-tool-bar flex gap-4 shrink-0">
                    <button className="svg-btn icon-btn hover:text-(--text-active) transition-colors cursor-pointer p-1">
                        <Download size={20} />
                    </button>

                    <button className="svg-btn icon-btn hover:text-(--text-active) transition-colors cursor-pointer p-1">
                        <Copy size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}