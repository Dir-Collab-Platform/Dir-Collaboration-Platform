import { Plus } from "lucide-react";
import Button from "../../../common-components/button";
import Input, { TextArea } from "../../../common-components/input";
import { useAuth } from "../../../context/AuthContext/AuthContext";
import { apiRequest } from "../../../services/api/api";
import { useState, useEffect } from "react";

export default function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const [bio, setBio] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize state from context
  useEffect(() => {
    if (user) {
      setBio(user.bio || '');
      setProfileUrl(user.profileUrl || '');
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await apiRequest('/api/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          bio: bio,
          profileUrl: profileUrl
        })
      });
      if (res.status === 'success') {
        await refreshUser();
      }
    } catch (err) {
      console.error("Save profile failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setBio(user.bio || '');
      setProfileUrl(user.profileUrl || '');
    }
  };

  return (
    <>
      <Input
        label="Name"
        value={user?.githubUsername || ''} // Using username as name placeholder
        readOnly
        placeholder={"Name"}
        description={
          "Your name may appear around Dir where you contribute or are mentioned"
        }
      />
      <Input
        className={"mt-2"}
        label="Github Handle"
        value={user?.githubUsername || ''}
        readOnly
        placeholder={"github.com/username"}
        description={"You can see your github handle here"}
      />
      <TextArea
        className={"mt-2"}
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder={"Tell us a little bit about yourself"}
        description={
          "You can @mention other users and organizations to link to them"
        }
        height="141px"
      />
      <div>
        <Input
          className={"mt-2"}
          label="Social Accounts (Profile URL)"
          value={profileUrl}
          onChange={(e) => setProfileUrl(e.target.value)}
          placeholder={"https://link.to/social/profile"}
          description={"Add a link to your primary social profile"}
        />
        {/* 'Add' button kept for visual consistency, but currently disabled/no-op as we map to single profileUrl */}
        <Button
          className={
            " rounded-xl flex gap-2 py-1 px-4 justify-center items-center px-4 font-normal mt-2 opacity-50 cursor-not-allowed"
          }
          variant="base"
          disabled
        >
          <Plus size={16} />
          <span>Add</span>
        </Button>
      </div>
      <div className="flex gap-5 mt-5">
        <Button
          className={" rounded-xl py-2 px-16"}
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          className={"rounded-xl py-2 px-16"}
          variant="base"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
      </div>
    </>
  );
}
