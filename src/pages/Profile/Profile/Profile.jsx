import Button from "../../../common-components/button";
import Header from "../../../common-components/Header/Header";
import ProfileForm from "../ProfileForm/ProfileForm";
import Sidebar from "../Sidebar/Sidebar";

export default function Profile() {
  return (
    <div className="min-h-screen">
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <h1 className="text-lg font-semibold">Public Profile</h1>
          <Button className="px-3">Log out</Button>
        </div>

        <div className="flex gap-6">
          <div className="w-full md:w-2/3">
            <ProfileForm />
          </div>

          <div className="hidden md:block md:w-1/3">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
