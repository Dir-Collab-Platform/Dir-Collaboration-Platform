import { CodeBody } from "./Code/CodeBody.jsx";
import RepoSidebar from "./Code/RepoSidebar.jsx";

export default function CodePanel() {
    return (
        <div className="code-panel grid grid-cols-[17rem_1fr] gap-8 border border-(--main-border-color) h-full rounded-2xl overflow-hidden">
            <RepoSidebar />
            <CodeBody />
        </div>
    )
}