import Footer from "../../common-components/Footer/Footer"
import Header from "../../common-components/Header/Header"
import CodePanel from "../Workspace/components/CodePanel"
import WorkspaceHeader from "../Workspace/components/WorkspaceHeader"
import "./Repository.css"

export default function Repository() {
    return (
        <>
            <Header />
            <div className="workspace max-w-375 m-auto min-h-[calc(100vh-80px)] flex flex-col">
                <WorkspaceHeader />

                <CodePanel />
            </div>
            <Footer />
        </>
    )
}