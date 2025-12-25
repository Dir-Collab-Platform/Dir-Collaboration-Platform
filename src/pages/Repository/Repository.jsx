import Footer from "../../common-components/Footer/Footer"
import Header from "../../common-components/Header/Header"
import CodePanel from "../Workspace/components/CodePanel"
import WorkspaceHeader from "../Workspace/components/Code/WorkspaceHeader"
import "./Repository.css"

export default function Workspace() {
    return (
        <>
            <Header />
            <div className="workspace max-w-[1500px] m-auto min-h-[calc(100vh-80px)] flex flex-col">
                <WorkspaceHeader />

                <CodePanel />
            </div>
            <Footer />
        </>
    )
}