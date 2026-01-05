import Footer from "../../common-components/Footer/Footer";
import Header from "../../common-components/Header/Header";
import WorkSpaceList from "./WorkSpaceList";
import WorkSpacesHeader from "./WorkSpacesHeader";

export default function () {
  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-6">
        <WorkSpacesHeader />
        <hr className="border-(--main-border-color) my-8" />
        <WorkSpaceList />
      </div>
      <Footer />
    </>
  );
}
