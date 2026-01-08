import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, Folder, Star } from "lucide-react";
import Button from "../../common-components/button";
import RepositoryCard from './RepositoryCard';
import { RepositoriesContext } from '../../context/RepositoriesContext/RepositoriesContext';
import { UserContext } from '../../context/UserContext/UserContext';
import { mockLanguages, mockUsers } from '../../data/mockData';

function RepositoryList() {
  const { repositories, isLoading } = useContext(RepositoriesContext);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepos = repositories.filter((repo) =>
    repo.githubRepoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6" style={{ color: 'var(--secondary-text-color)' }}>
        Loading repositories...
      </div>
    );
  }

  return (
    <>
      {/* USER PROFILE HEADER */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {/* Left: User avatar and basic info */}
          <div className="flex items-center gap-4">
            <img 
              src={currentUser?.avatarUrl || "https://via.placeholder.com/60"} 
              alt="Profile" 
              className="rounded-full w-14 h-14"
            />
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--primary-text-color)' }}>
                {currentUser?.githubUsername || "User"}
              </h2>
              <span style={{ color: 'var(--secondary-text-color)' }}>@{currentUser?.githubUsername?.toLowerCase() || "user"}</span>
            </div>
          </div>
          
          {/* Right: Repository and star statistics */}
          <div className="flex gap-8">
            <div className="text-center flex gap-2">
              <Folder />
              <div className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>Repositories</div>
              <div className="font-bold" style={{ color: 'var(--primary-text-color)' }}>{filteredRepos.length}</div>
            </div>
            <div className="text-center flex gap-2">
              <Star />
              <div className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>Stars</div>
              <div className="font-bold" style={{ color: 'var(--primary-text-color)' }}>
                {repositories.reduce((acc, repo) => acc + (repo.stars || 0), 0)}
              </div>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'var(--main-border-color)' }} />
      </header>

      {/* SEARCH INPUT */}
      <div className="flex w-full items-center gap-5 mb-6">
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
            style={{
              backgroundColor: 'var(--secondary-button)',
              color: 'var(--primary-text-color)',
              border: '1px solid var(--main-border-color)'
            }}
          >
            <ChevronDown />
            <span>Sort</span>
          </Button>
        </div>
      </div>

      {/* REPOSITORY CARDS LIST */}
      <div className="rounded-xl flex flex-col items-center justify-center border" style={{ 
        backgroundColor: 'var(--dimmer-dark-bg)',
        borderColor: 'var(--main-border-color)'
      }}>
        {filteredRepos.map((repo) => {
          const languages = mockLanguages[repo._id] || [];
          const contributors = repo.members?.slice(0, 4).map(mem => {
            const user = mockUsers.find(u => u._id === mem.userId);
            return user?.avatarUrl || "https://via.placeholder.com/40";
          }) || [];
          
          return (
            <div key={repo._id} onClick={() => navigate(`/repository/${repo._id}`)} className="w-full cursor-pointer">
              <RepositoryCard
                name={repo.githubRepoName}
                visibility={repo.isPrivate ? "private" : "public"}
                description={repo.description}
                stars={repo.stars || Math.floor(Math.random() * 300)}
                updatedAt={new Date(repo.updatedAt).toLocaleDateString()}
                languages={languages}
                contributors={contributors}
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

export default RepositoryList;
