import { GitFork, GitPullRequest } from "lucide-react";
import MetaTag from "../../../common-components/MetaTag";

function CounterButton({icon, name, count}) {
    return (
        <button className="svg-btn paragraph2 flex gap-3 bg-(--secondary-button) h-10 px-4 rounded-lg items-center hover:bg-(--secondary-button-hover) hover:cursor-pointer transition-all border border-(--main-border-color)">
            <span>{icon}</span> 
            <span>{name}</span> 
            <span className="font-extrabold">{count}</span>
        </button>
    )
}

export default function WorkspaceHeader() {
    return (
        <div className="flex justify-between py-4 px-6">
            <div className="workspace-name flex gap-4 font-semibold items-center">
                {/* tobe replaced by actual data */}
                <h1 className="header1">username/My-repository</h1>
                <MetaTag name='public' />
            </div>

            <div className="buttons flex gap-4">
                <CounterButton icon={<GitFork />} name='Fork' count={0} />
                <CounterButton icon={<GitPullRequest />} name='Pull Requests' count={0} />
            </div>
        </div>
    )
}