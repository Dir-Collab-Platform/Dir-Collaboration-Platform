import Footer from "../../common-components/Footer/Footer";
import Header from "../../common-components/Header/Header";
import WorkSpaceList from "./WorkSpaceList";
import { WorkspacesContext } from '../../context/WorkspacesContext/WorkspacesContext';
import WorkspacesProvider from '../../context/WorkspacesContext/WorkspacesProvider';

function WorkspacesContent() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-6">
        <WorkSpaceList />
      </div>
      <Footer />
    </>
  );
}

export default function Workspaces() {
  return (
    <WorkspacesProvider>
      <WorkspacesContent />
    </WorkspacesProvider>
  );
}
