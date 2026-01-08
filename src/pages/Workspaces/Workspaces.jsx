import Footer from "../../common-components/Footer/Footer";
import Header from "../../common-components/Header/Header";
import WorkSpaceList from "./WorkSpaceList";
import WorkSpacesHeader from "./WorkSpacesHeader";
import { WorkspacesContext } from '../../context/WorkspacesContext/WorkspacesContext';
import WorkspacesProvider from '../../context/WorkspacesContext/WorkspacesProvider';

function WorkspacesContent() {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-6">
        <WorkSpacesHeader />
        <hr className="my-8" style={{ borderColor: 'var(--main-border-color)' }} />
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
