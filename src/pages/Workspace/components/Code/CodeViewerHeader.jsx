import { Code, Copy, Download, GitBranch } from "lucide-react"
import CodeToolBar from "./CodeToolBar"

function MetaTagWithIcon({icon, name}) {
    return (
        <span className="svg-btn flex gap-2 w-fit bg-(--meta-tag-color) text-(--secondary-text-color) h-fit px-2.5 py-0.5 rounded-2xl items-center">
            {icon}
            <p>{name}</p>
        </span>
    )
}

export default function CodeViewerHeader() {
    return (
        <div className="code-viewer-header">
            <div className="upper flex justify-between">
                <div className="file-path-branch flex gap-2 items-center">
                    <h2 className="header2 text-semibold">
                        My-repositry/src/<span className="text-(--active-text-color)">main.js</span>
                    </h2>
                    <MetaTagWithIcon icon={<GitBranch />} name='main' />
                </div>

                <CodeToolBar />
            </div>

            <div className="lower flex justify-between pr-6 py-2">
                <div className="last-commit flex gap-2">
                    Last commit 
                    <p className="font-extrabold">username</p>
                    <p>'fixed the bug in the chat featu...'</p>
                    <p>4ed6gh</p>
                    <p>
                        <span className="font-extrabold">2mo</span> ago
                    </p>
                </div>

                <div className="lower-tool-bar flex gap-4">
                    <button className="svg-btn icon-btn">
                        <Download />
                    </button>

                    <button className="svg-btn icon-btn">
                        <Copy />
                    </button>
                </div>
            </div>
        </div>
    )
}