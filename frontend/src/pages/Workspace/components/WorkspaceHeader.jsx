import { GitFork, GitPullRequest, MessageSquare, Plus } from "lucide-react";
import MetaTag from "../../../common-components/MetaTag";
import { useContext } from "react";
import { WorkspaceContext } from "../../../context/WorkspaceContext/WorkspaceContext";

function ForkButton({ count }) {
    return (
        <button className="svg-btn paragraph2 flex gap-3 bg-(--secondary-button) h-10 px-4 rounded-lg items-center hover:bg-(--secondary-button-hover) hover:cursor-pointer transition-all border border-(--main-border-color)">
            <span><GitFork size={18} /></span>
            <span>Fork</span>
            <span className="font-extrabold">{count}</span>
        </button>
    );
}

function PullRequestButton({ count }) {
    return (
        <button className="svg-btn paragraph2 flex gap-3 bg-(--secondary-button) h-10 px-4 rounded-lg items-center hover:bg-(--secondary-button-hover) hover:cursor-pointer transition-all border border-(--main-border-color)">
            <span><GitPullRequest size={18} /></span>
            <span>Pull Requests</span>
            <span className="font-extrabold">{count}</span>
        </button>
    );
}

function CreateWorkspaceButton({ onClick }) {
    return (
        <button onClick={onClick} className="svg-btn paragraph2 flex gap-3 bg-(--primary-button) h-10 px-4 rounded-lg items-center hover:bg-(--primary-button-hover) hover:cursor-pointer transition-all">
            <span><Plus size={18} /></span>
            <span>Create Workspace</span>
        </button>
    );
}

function ChatToggleButton({ onClick, isOpen }) {
    return (
        <button onClick={onClick} className={`svg-btn paragraph2 flex gap-3 h-10 px-4 rounded-lg items-center hover:cursor-pointer transition-all border border-(--main-border-color) lg:hidden ${isOpen ? 'bg-(--secondary-button-hover)' : 'bg-(--secondary-button)'}`}>
            <span><MessageSquare size={18} /></span>
        </button>
    );
}

export default function WorkspaceHeader({ showRepoView, onCreateWorkspace, onToggleChat, showChat }) {
    const { repository, isLoading } = useContext(WorkspaceContext);

    if (isLoading) {
        return (
            <div className="flex justify-between py-4 px-6 animate-pulse">
                <div className="h-8 w-64 bg-(--secondary-button) rounded-lg" />
                <div className="flex gap-4">
                    <div className="h-10 w-24 bg-(--secondary-button) rounded-lg" />
                    <div className="h-10 w-32 bg-(--secondary-button) rounded-lg" />
                </div>
            </div>
        );
    }

    if (!repository) return null;

    return (
        <div className="flex justify-between py-4 px-6">
            <div className="workspace-name flex gap-4 font-semibold items-center">
                <h1 className="header1 text-(--primary-text-color)">
                    {repository.full_name}
                </h1>
                <MetaTag name={repository.visibility || (repository.private ? 'private' : 'public')} />
            </div>

            <div className="buttons flex gap-4">
                {showRepoView && <CreateWorkspaceButton onClick={onCreateWorkspace} />}
                {!showRepoView && <ChatToggleButton onClick={onToggleChat} isOpen={showChat} />}
                <ForkButton count={repository.forks_count || 0} />
                <PullRequestButton count={repository.open_issues_count || 0} />
            </div>
        </div>
    );
}