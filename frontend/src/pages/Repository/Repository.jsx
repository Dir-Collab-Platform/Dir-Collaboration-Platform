import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Footer from "../../common-components/Footer/Footer"
import Header from "../../common-components/Header/Header"
import CodePanel from "../Workspace/components/CodePanel"
import WorkspaceHeader from "../Workspace/components/WorkspaceHeader"
import { RepositoriesContext } from '../../context/RepositoriesContext/RepositoriesContext';
import RepositoriesProvider from '../../context/RepositoriesContext/RepositoriesProvider';
import PageLoader from '../../common-components/PageLoader';

function RepositoryContent() {
  const { id } = useParams();
  const { getRepository, isLoading } = useContext(RepositoriesContext);
  const repo = getRepository(id);

  if (isLoading) {
    return <PageLoader msg="Loading repository..." />;
  }

  if (!repo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--dark-bg)">
        <div className="text-center">
          <h2 className="header2 mb-4 text-(--primary-text-color)">Repository not found</h2>
          <p className="text-(--secondary-text-color)">The repository you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="workspace max-w-375 m-auto min-h-[calc(100vh-80px)] flex flex-col">
        <WorkspaceHeader />
        <CodePanel />
      </div>
      <Footer />
    </>
  );
}

export default function Repository() {
  return (
    <RepositoriesProvider>
      <RepositoryContent />
    </RepositoriesProvider>
  );
}
