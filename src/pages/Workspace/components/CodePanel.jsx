import { CodeBody } from "./CodeBody.jsx";
import RepoSidebar from "./RepoSidebar.jsx";

export default function CodePanel() {
    return (
        <div className="grid grid-cols-[17rem_1fr] border border-(--main-border-color) h-full rounded-2xl overflow-hidden">
            <RepoSidebar />
            <CodeBody />
        </div>
    )
}