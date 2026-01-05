import { useContext } from 'react';
import Header from "../../common-components/Header/Header";
import WorkspaceHeader from "./components/WorkspaceHeader";
import CodePanel from "./components/CodePanel";
import ChatPanel from "./components/ChatPanel";
import PageLoader from '../../common-components/PageLoader';

import { WorkspaceContext } from "../../context/WorkspaceContext/WorkspaceContext";
import WorkspaceProvider from "../../context/WorkspaceContext/WorkspaceProvider";
import ChatProvider from '../../context/WorkspaceContext/ChatProvider';


function WorkspaceContent({ isRepositoryView }) {
    const { isLoading, error } = useContext(WorkspaceContext);

    if (isLoading) return <PageLoader msg="Syncing repository" />;
    
    if (error) return (
        // refactor this to have a common Error Component
        <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-(--dark-bg)">
            <div className="bg-red-500/10 border border-(--main-border-color) p-6 rounded-2xl max-w-md">
                <h3 className="header2 text-red-500 font-bold mb-2">Workspace Error</h3>
                <p className="paragraph2 text-(--secondary-text-color) mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="primary-btn px-6 py-2"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="workspace-page flex flex-col h-[calc(100vh-var(--body-padding-top))] overflow-hidden">

                <section className="shrink-0">
                    <WorkspaceHeader />
                </section>

                <main className={`grow grid gap-6 px-6 pb-6 overflow-hidden 
                    ${isRepositoryView 
                        ? "grid-cols-1" 
                        : "grid-cols-1 lg:grid-cols-[1fr_28rem] xl:grid-cols-[1fr_34rem]"
                    }`}
                >
                    <div className="flex flex-col min-h-0 h-full overflow-hidden">
                        <CodePanel />
                    </div>

                    {/*  */}
                    {!isRepositoryView && (
                        <div className="hidden lg:flex flex-col min-h-0 h-full overflow-hidden">
                            <ChatPanel />
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

export default function Workspace(props) {
    return (
        <WorkspaceProvider>
            <ChatProvider>
                <WorkspaceContent {...props} />
            </ChatProvider>
        </WorkspaceProvider>
    );
}