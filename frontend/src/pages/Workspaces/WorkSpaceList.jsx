import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from "lucide-react";
import Button from "../../common-components/button";
import WorkSpacesSlot from "./WorkSpacesSlot";
import { WorkspacesContext } from '../../context/WorkspacesContext/WorkspacesContext';
import { UserContext } from '../../context/UserContext/UserContext';
import { mockLanguages, mockUsers } from '../../data/mockData';

import { getRelativeTime } from '../../utils/utils';

export default function WorkSpaceList() {
  const { workspaces, isLoading } = useContext(WorkspacesContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.workspaceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ws.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleWorkspaceClick = (workspaceId) => {
    navigate(`/workspace/${workspaceId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6" style={{ color: 'var(--secondary-text-color)' }}>
        Loading workspaces...
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full items-center gap-5">
        <div className="flex w-5/6 items-center">
          <div className="relative flex flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--secondary-text-color)' }} />
            <input
              type="text"
              placeholder="Search for repositories..."
              className="flex-1 pl-12 py-2.5 rounded-l-xl focus:outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--secondary-button-hover)',
                border: '1px solid var(--main-border-color)',
                color: 'var(--primary-text-color)'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button variant="primary" className="py-2.5 px-6 rounded-r-xl">
            Search
          </Button>
        </div>

        <div className="w-1/6">
          <Button
            variant="base"
            className="w-full flex justify-center items-center py-2.5 rounded-xl gap-2"
          >
            <ChevronDown />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      <div className="rounded-xl my-4 flex flex-col items-center justify-center border" style={{
        backgroundColor: 'var(--dimmer-dark-bg)',
        borderColor: 'var(--main-border-color)'
      }}>
        {filteredWorkspaces.map((workspace) => {
          const languages = mockLanguages[workspace._id] || [];
          const contributors = workspace.members?.slice(0, 4).map(mem => {
            const user = mockUsers.find(u => u._id === mem.userId);
            return user?.avatarUrl || "https://via.placeholder.com/40";
          }) || [];

          return (
            <div key={workspace._id} onClick={() => handleWorkspaceClick(workspace._id)} className="w-full cursor-pointer">
              <WorkSpacesSlot
                projectName={workspace.workspaceName}
                visibility={workspace.isPrivate ? "private" : "public"}
                description={workspace.description}
                stars={workspace.stars || 0}
                contributors={contributors}
                updatedAt={"Last updated " + getRelativeTime(workspace.updatedAt) + " ago"}
                languages={languages}
              />
            </div>
          );
        })}
        <Button variant="primary" className={"px-12 py-2 rounded-lg my-2"}>
          Load More
        </Button>
      </div>
    </>
  );
}
