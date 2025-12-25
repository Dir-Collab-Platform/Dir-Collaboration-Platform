import Footer from "../../common-components/Footer/Footer"
import Header from "../../common-components/Header/Header"
import ChatPanel from "./components/ChatPanel"
import CodePanel from "./components/CodePanel"
import WorkspaceHeader from "./components/Code/WorkspaceHeader"

export default function Workspace() {
    return (
        <>
            <Header />
            <div className="workspace min-h-[calc(100vh-80px)] flex flex-col">
                <WorkspaceHeader />

                <div className="workspace-body grow grid grid-cols-[1fr_34rem] gap-6 px-6">
                    <CodePanel />
                    <ChatPanel />
                </div>
            </div>
            <Footer />
        </>
    )
}