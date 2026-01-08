import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from "../../common-components/Header/Header";
import WorkspaceHeader from "./components/WorkspaceHeader";
import CodePanel from "./components/CodePanel";
import ChatPanel from "./components/ChatPanel";
import PageLoader from '../../common-components/PageLoader';

import { WorkspaceContext } from "../../context/WorkspaceContext/WorkspaceContext";
import WorkspaceProvider from "../../context/WorkspaceContext/WorkspaceProvider";
import ChatProvider from '../../context/WorkspaceContext/ChatProvider';


function WorkspaceContent({ isRepositoryView }) {
    const { isLoading, error, repository } = useContext(WorkspaceContext);

    // State for chat panel toggle on mobile/small screens
    const [showChat, setShowChat] = useState(false);

    // State for create workspace modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState('');

    if (isLoading) return <PageLoader msg="Syncing repository" />;

    if (error) return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center" style={{ backgroundColor: 'var(--dark-bg)' }}>
            <div className="bg-red-500/10 border p-6 rounded-2xl max-w-md" style={{ borderColor: 'var(--main-border-color)' }}>
                <h3 className="header2 text-red-500 font-bold mb-2">Workspace Error</h3>
                <p className="paragraph2 mb-4" style={{ color: 'var(--secondary-text-color)' }}>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="primary-btn px-6 py-2"
                >
                    Retry Connection
                </button>
            </div>
        </div>
    );

    // If it's explicitly a repo view OR the data says it's not a workspace (not imported), treat as repo view
    const showRepoView = isRepositoryView || (repository && !repository.isImported);

    const handleCreateWorkspaceClick = () => {
        setIsCreateModalOpen(true);
    };

    const submitCreateWorkspace = () => {
        // Logic to create workspace would go here
        alert(`Creating workspace: ${newWorkspaceName}`);
        setIsCreateModalOpen(false);
        setNewWorkspaceName('');
    };

    return (
        <>
            <Header />
            <div className={`workspace-page flex flex-col h-[calc(100vh-var(--body-padding-top))] overflow-hidden ${showRepoView ? 'max-w-[1200px] mx-auto w-full border-x border-(--main-border-color)' : ''}`}>

                <section className="shrink-0">
                    <WorkspaceHeader
                        showRepoView={showRepoView}
                        onCreateWorkspace={handleCreateWorkspaceClick}
                        onToggleChat={() => setShowChat(!showChat)}
                        showChat={showChat}
                    />
                </section>

                <main className={`grow grid gap-6 px-6 pb-6 overflow-hidden relative
                    ${showRepoView
                        ? "grid-cols-1"
                        : "grid-cols-1 lg:grid-cols-[1fr_28rem] xl:grid-cols-[1fr_34rem]"
                    }`}
                >
                    <div className="flex flex-col min-h-0 h-full overflow-hidden">
                        <CodePanel />
                    </div>

                    {!showRepoView && (
                        <>
                            {/* Desktop Chat Panel */}
                            <div className="hidden lg:flex flex-col min-h-0 h-full overflow-hidden">
                                <ChatPanel />
                            </div>

                            {/* Mobile Chat Panel Overlay */}
                            {showChat && (
                                <div className="absolute inset-0 z-50 lg:hidden flex flex-col bg-(--dark-bg)">
                                    <ChatPanel />
                                    <button
                                        onClick={() => setShowChat(false)}
                                        className="absolute top-2 right-2 p-2 bg-(--secondary-button) rounded-full text-(--primary-text-color)"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Create Workspace Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <div className="bg-(--card-bg) border border-(--main-border-color) rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 flex flex-col gap-6">
                            <h3 className="text-xl font-bold text-(--primary-text-color)">Create Workspace</h3>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-(--secondary-text-color) uppercase tracking-wider">
                                    Workspace Name
                                </label>
                                <input
                                    type="text"
                                    value={newWorkspaceName}
                                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                                    placeholder="e.g. My Workspace"
                                    autoFocus
                                    className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl py-2.5 px-4 text-sm text-(--primary-text-color) outline-none focus:border-(--active-text-color) transition-all"
                                />
                                <p className="text-xs text-(--secondary-text-color)">
                                    Enter a name for your new workspace.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-(--secondary-text-color) hover:text-(--primary-text-color) transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitCreateWorkspace}
                                    disabled={!newWorkspaceName.trim()}
                                    className="bg-(--primary-button) text-(--button-text-color) px-6 py-2 rounded-xl text-sm font-bold hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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
