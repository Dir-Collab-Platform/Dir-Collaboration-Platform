import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext/AuthContext";
import Header from "../../common-components/Header/Header";
import ProfileForm from "./ProfileForm";
import Sidebar from "./Sidebar";
import Button from "../../common-components/button";
import Footer from "../../common-components/Footer/Footer";
import { ProfileContext } from '../../context/ProfileContext/ProfileContext';
import ProfileProvider from '../../context/ProfileContext/ProfileProvider';

import { useNavigate } from "react-router-dom";

function ProfileContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Header />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <h1 className="text-lg font-semibold text-(--primary-text-color)">Public Profile</h1>
          <Button
            variant="outline"
            className="rounded-2xl flex justify-center items-center gap-3 py-3 px-3 hover:bg-(--hover-bg)"
            onClick={handleLogout}
          >
            <LogOut />
            <span className="text-(--secondary-text-color)">Log out</span>
          </Button>
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
      <Footer />
    </>
  );
}

export default function Profile() {
  return (
    <ProfileProvider>
      <ProfileContent />
    </ProfileProvider>
  );
}
