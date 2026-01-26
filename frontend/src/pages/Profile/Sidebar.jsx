import { Pencil, Sun, Moon, Monitor, Bell, BellOff } from "lucide-react";
import Button from "../../common-components/button";
import { useAuth } from "../../context/AuthContext/AuthContext";
import { apiRequest } from "../../services/api/api";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { user, refreshUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [localTheme, setLocalTheme] = useState(localStorage.getItem('theme') || user?.preferences?.theme || 'system');
  const [localNotif, setLocalNotif] = useState(user?.preferences?.notificationsEnabled ?? true);

  // Sync local state with context when user data loads
  useEffect(() => {
    if (user) {
      setLocalNotif(user.preferences?.notificationsEnabled ?? true);
      if (!localStorage.getItem('theme')) {
        setLocalTheme(user.preferences?.theme || 'system');
      }
    }
  }, [user]);

  const handleThemeChange = (newTheme) => {
    setLocalTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Trigger a custom event so ThemeSynchronizer picks it up in the same tab
    window.dispatchEvent(new Event('theme-change'));

    // Also update backend as a fallback/sync
    handlePreferenceChange('theme', newTheme);
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      setIsUpdating(true);
      const payload = {};
      if (key === 'theme') payload.theme = value;
      if (key === 'notification') {
        payload.notificationsEnabled = value;
        setLocalNotif(value);
      }

      await apiRequest('/api/profile', {
        method: 'PATCH',
        body: payload
      });

      // No need to refreshUser immediately as we have local state, 
      // but good for long-term consistency
      await refreshUser();
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
          className="w-64 h-64 rounded-full object-cover border-4 border-(--bg-card-hover)"
          src={user?.avatarUrl || "https://github.com/identicons/default.png"}
          alt="profilepic"
        />
        <Button className="rounded-md py-2 absolute top-2 right-4 px-4 flex justify-center items-center gap-3 bg-(--bg-card) border border-(--border-main) hover:bg-(--bg-card-hover)">
          <Pencil size={20} className="text-(--text-primary)" />
          <span className="font-normal text-(--text-primary)">Edit</span>
        </Button>
      </div>

      <div className={`mt-8 ${isUpdating ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}`}>
        <h3 className="font-bold text-2xl text-(--text-primary)">
          Preferences
        </h3>
        <hr className="border-(--border-main) my-4 max-w-xs" />

        <div className="mb-8">
          <p className="font-semibold text-lg mb-4 text-(--text-primary) flex items-center gap-2">
            {localNotif ? <Bell size={18} /> : <BellOff size={18} />}
            Notifications
          </p>
          <div className="flex bg-(--bg-dim) p-1 rounded-xl w-fit border border-(--border-main)">
            <button
              onClick={() => handlePreferenceChange('notification', true)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${localNotif ? 'bg-(--button-primary) text-white shadow-lg' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}
            >
              Enabled
            </button>
            <button
              onClick={() => handlePreferenceChange('notification', false)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!localNotif ? 'bg-(--button-primary) text-white shadow-lg' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}
            >
              Disabled
            </button>
          </div>
        </div>

        <div>
          <p className="font-semibold text-lg mb-4 text-(--text-primary) flex items-center gap-2">
            <Sun size={18} />
            Theme
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-xs">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${localTheme === t.id
                  ? 'bg-(--bg-active) border-(--text-active) text-(--text-active) shadow-inner'
                  : 'bg-(--bg-card) border-(--border-main) text-(--text-secondary) hover:border-(--text-dim)'}`}
              >
                <t.icon size={24} />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
