import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Folder, Star } from "lucide-react";
import Button from "../../common-components/button";
import RepositoryCard from './RepositoryCard';
import { RepositoriesContext } from '../../context/RepositoriesContext/RepositoriesContext';
import { UserContext } from '../../context/UserContext/UserContext';
import { mockLanguages, mockUsers } from '../../data/mockData';

import { getRelativeTime } from '../../utils/utils';

function RepositoryList() {
  const { repositories, isLoading } = useContext(RepositoriesContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = repositories.filter((repo) =>
    repo.githubRepoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 text-(--secondary-text-color)">
        Loading repositories...
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      {/* USER PROFILE HEADER */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Left: User avatar and basic info */}
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || "https://via.placeholder.com/60"}
              alt="Profile"
              className="rounded-full w-14 h-14"
            />
            <div>
              <h2 className="text-2xl font-bold text-(--primary-text-color)">
                {user?.githubUsername || "User"}
              </h2>
              <span className="text-(--secondary-text-color)">@{user?.githubUsername?.toLowerCase() || "user"}</span>
            </div>
          </div>

          {/* Right: Repository and star statistics */}
          <div className="flex gap-8">
            <div className="text-center flex gap-2">
              <Folder />
              <div className="text-sm text-(--secondary-text-color)">Repositories</div>
              <div className="font-bold text-(--primary-text-color)">{filteredRepos.length}</div>
            </div>
            <div className="text-center flex gap-2">
              <Star />
              <div className="text-sm text-(--secondary-text-color)">Stars</div>
              <div className="font-bold text-(--primary-text-color)">
                {repositories.reduce((acc, repo) => acc + (repo.stars || 0), 0)}
              </div>
            </div>
          </div>
        </div>
        <hr className="border-(--main-border-color)" />
      </header>

      {/* SEARCH INPUT */}
      <div className="flex w-full items-center gap-5 mb-6">
        <div className="flex w-5/6 items-center">
          <div className="relative flex flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-(--secondary-text-color)" size={20} />
            <input
              type="text"
              placeholder="Search for repositories..."
              className="flex-1 pl-12 py-2.5 rounded-l-xl focus:outline-none focus:ring-2 bg-(--secondary-button-hover) border border-(--main-border-color) text-(--primary-text-color)"
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
            className="w-full flex justify-center items-center py-2.5 rounded-xl gap-2 bg-(--secondary-button) text-(--primary-text-color) border border-(--main-border-color)"
          >
            <ChevronDown />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      {/* REPOSITORY LIST CONTAINER */}
      <div className="rounded-xl border border-(--main-border-color) overflow-hidden bg-(--dimmer-dark-bg)">
        <div className="divide-y divide-(--main-border-color)">
          {filteredRepos.map((repo) => {
            const languages = mockLanguages[repo._id] || [];
            const contributors = repo.members?.slice(0, 4).map(mem => {
              const user = mockUsers.find(u => u._id === mem.userId);
              return user?.avatarUrl || "https://via.placeholder.com/40";
            }) || [];

            return (
              <div key={repo._id} onClick={() => navigate(`/repository/${repo._id}`)}>
                <RepositoryCard
                  name={repo.githubRepoName}
                  visibility={repo.isPrivate ? "private" : "public"}
                  description={repo.description}
                  stars={repo.stars || 0}
                  updatedAt={"Last updated " + getRelativeTime(repo.updatedAt) + " ago"}
                  languages={languages}
                  isImported={repo.isImported}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button variant="primary" className="px-12 py-2 rounded-lg">
          Load More
        </Button>
      </div>
    </div>
  );
}

export default RepositoryList;
