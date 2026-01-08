import { useContext } from "react"
import { Code, GitBranch, GitCommit, Star, Trash2 } from "lucide-react"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"

function CommitBtn() {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <GitCommit />
            {/* to be replaced by real data */}
            <span className="text-(--secondary-text-color) text-bold">8</span>
        </button>
    )
}

function CloneBtn() {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <Code />
        </button>
    )
}

function BranchBtn() {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <GitBranch />
            {/* to be replaced by real data */}
            <span className="text-(--secondary-text-color) text-bold">4</span>
        </button>
    )
}

function StartBtn({ stars }) {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <Star />
            <span className="text-(--secondary-text-color) text-bold">{stars}</span>
        </button>
    )
}

function DeleteBtn() {
    return (
        <button className="svg-btn icon-btn flex gap-2 items-center">
            <Trash2 />
        </button>
    )
}

export default function CodeToolBar() {
    const { repository } = useContext(WorkspaceContext);

    return (
        <div className="flex gap-6 bg-(--card-bg-lighter) border border-(--main-border-color) rounded-bl-full rounded-tr-2xl px-6 py-2">
            <CommitBtn />
            <CloneBtn />
            <BranchBtn />
            <StartBtn stars={repository?.stars || 0} />
            <DeleteBtn />
        </div>
    )
}