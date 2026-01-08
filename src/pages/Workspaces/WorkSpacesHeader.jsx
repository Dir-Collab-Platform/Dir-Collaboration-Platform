import { useContext } from 'react';
import { Star, Workflow } from "lucide-react";
import { UserContext } from '../../context/UserContext/UserContext';
import { WorkspacesContext } from '../../context/WorkspacesContext/WorkspacesContext';

export default function WorkSpacesHeader() {
  const { user } = useContext(UserContext);
  const { workspaces } = useContext(WorkspacesContext);

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <img
          className="w-12 h-12 rounded-full"
          src={user?.avatarUrl || "https://via.placeholder.com/60"}
          alt="profilepic"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-(--primary-text-color)">
            {user?.githubUsername || "User"}
          </span>
          <span className="font-light text-xs text-(--secondary-text-color)">
            @{user?.githubUsername?.toLowerCase() || "username"}
          </span>
        </div>
      </div>
      <div className="flex gap-4">
        <span className="flex text-sm font-semibold gap-2 text-(--primary-text-color)">
          <Workflow size={16} />
          Workspaces {workspaces?.length || 0}
        </span>
        <span className="flex text-sm font-semibold gap-2 text-(--primary-text-color)">
          <Star size={16} />
          Stars {workspaces?.reduce((acc, ws) => acc + (ws.stars || 0), 0)}
        </span>
      </div>
    </div>
  );
}
