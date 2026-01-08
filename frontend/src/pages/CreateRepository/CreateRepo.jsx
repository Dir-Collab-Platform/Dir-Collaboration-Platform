import Footer from "../../common-components/Footer/Footer";
import Header from "../../common-components/Header/Header";
import CreateRepoForm from "./CreateRepoForm";

export default function CreateRepo() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center mx-auto">
        <CreateRepoForm />
      </div>
      <Footer />
    </>
  );
}
