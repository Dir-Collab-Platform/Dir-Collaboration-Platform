
import { Pencil } from "lucide-react";
import Button from "../../../common-components/button";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { apiRequest } from "../../../services/api/api";
import { useState } from "react";

export default function Sidebar() {
  const { user, refreshUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  // Defaults
  const theme = user?.preferences?.theme || 'system';
  const notificationsEnabled = user?.preferences?.notificationsEnabled ?? true;

  const handlePreferenceChange = async (key, value) => {
    try {
      setIsUpdating(true);
      const payload = {};
      if (key === 'theme') payload.theme = value;
      if (key === 'notification') payload.notificationsEnabled = value === 'on';

      const res = await apiRequest('/api/profile', {
        method: 'PATCH',
        body: payload
      });

      if (res.status === 'success') {
        await refreshUser();
      }
    } catch (err) {
      console.error("Failed to update preferences:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="relative max-w-xs">
        <img
          className="w-64 h-64 rounded-full object-cover border-4 border-(--card-bg-lighter)"
          src={user?.avatarUrl || "https://github.com/identicons/default.png"}
          alt="profilepic"
        />
        <Button className="rounded-md py-2 absolute top-2 right-4 px-4 flex justify-center items-center gap-3 bg-(--card-bg) border border-(--main-border-color) hover:bg-(--card-bg-lighter)">
          <Pencil size={20} className="text-(--primary-text-color)" />
          <span className="font-normal text-(--primary-text-color)">Edit</span>
        </Button>
      </div>
      <div className={isUpdating ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
        <h3 className="font-semibold text-2xl text-(--primary-text-color)">
          Preferences
        </h3>
        <hr className="border border-(--main-border-color) my-2 max-w-xs" />

        <div>
          <p className="font-semibold text-xl my-2 text-(--primary-text-color)">
            Notifications
          </p>
          <div className="flex gap-2 items-center mb-1.5 text-(--secondary-text-color) cursor-pointer" onClick={() => handlePreferenceChange('notification', 'on')}>
            <input
              type="radio"
              name="notification"
              id="notOn"
              checked={notificationsEnabled === true}
              readOnly
              className="accent-(--primary-button)"
            />
            <label htmlFor="notOn" className="cursor-pointer">On</label>
          </div>
          <div className="flex gap-2 items-center mb-1.5 text-(--secondary-text-color) cursor-pointer" onClick={() => handlePreferenceChange('notification', 'off')}>
            <input
              type="radio"
              name="notification"
              id="notOff"
              checked={notificationsEnabled === false}
              readOnly
              className="accent-(--primary-button)"
            />
            <label htmlFor="notOff" className="cursor-pointer">Off</label>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold text-xl my-2 text-(--primary-text-color)">
            Theme
          </p>
          <div className="flex gap-2 items-center mb-1.5 text-(--secondary-text-color) cursor-pointer" onClick={() => handlePreferenceChange('theme', 'light')}>
            <input
              type="radio"
              name="theme"
              id="light"
              checked={theme === 'light'}
              readOnly
              className="accent-(--primary-button)"
            />
            <label htmlFor="light" className="cursor-pointer">Light Mode</label>
          </div>
          <div className="flex gap-2 items-center mb-1.5 text-(--secondary-text-color) cursor-pointer" onClick={() => handlePreferenceChange('theme', 'dark')}>
            <input
              type="radio"
              name="theme"
              id="dark"
              checked={theme === 'dark' || theme === 'night'}
              readOnly
              className="accent-(--primary-button)"
            />
            <label htmlFor="dark" className="cursor-pointer">Night Mode</label>
          </div>
          <div className="flex gap-2 items-center mb-1.5 text-(--secondary-text-color) cursor-pointer" onClick={() => handlePreferenceChange('theme', 'system')}>
            <input
              type="radio"
              name="theme"
              id="system"
              checked={theme === 'system'}
              readOnly
              className="accent-(--primary-button)"
            />
            <label htmlFor="system" className="cursor-pointer">System Default</label>
          </div>
        </div>
      </div>
    </>
  );
}
