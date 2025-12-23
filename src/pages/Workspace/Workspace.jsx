import Header from "../../common-components/Header/Header"
import Chat from "./components/Chat"
import CodePanel from "./components/CodePanel"
import WorkspaceHeader from "./components/WorkspaceHeader"

export default function Workspace() {
    return (
        <>
            <Header />
            <WorkspaceHeader />

            <div className="workspace-body h-full grid grid-cols-[1fr_34rem] gap-8">
                <CodePanel />
                <Chat />
            </div>
        </>
    )
}