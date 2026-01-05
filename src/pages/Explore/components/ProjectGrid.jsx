import ProjectCard from "./ProjectCard";
import { ChevronDown } from 'lucide-react';

const ProjectGrid = ({ repos, onLoadMore, isLoading, showButton, activeFilter, onFilterChange }) => {
  return (
    <>
      <div className="w-auto max-w-75 pt-1 px-3 bg-(--card-bg-lighter) border border-(--main-border-color) border-b-none rounded-tl-2xl rounded-tr-[76px] text-(--secondary-text-color) text-[14px] flex items-end">
        <button 
          onClick={() => onFilterChange("all")}
          className={`px-4 pt-1.5 transition ${activeFilter === 'all' ? 'bg-(--active-tab-bg) border border-(--main-border-color) border-b-none rounded-t-2xl text-white' : ''}`}
        >
          All
        </button>
        <button 
          onClick={() => onFilterChange("repository")}
          className={`px-4 pt-1.5 transition ${activeFilter === 'repository' ? 'bg-(--active-tab-bg) border border-(--main-border-color) border-b-none rounded-t-2xl text-white' : ''}`}
        >
          Repositories
        </button>
        <button 
          onClick={() => onFilterChange("workspace")}
          className={`px-4 pt-1.5 transition ${activeFilter === 'workspace' ? 'bg-(--active-tab-bg) border border-(--main-border-color) border-b-none rounded-t-2xl text-white' : ''}`}
        >
          Workspaces
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-(--dimmer-dark-bg) border border-(--main-border-color) rounded-b-2xl rounded-tr-2xl min-h-75">
        {repos.length > 0 ? (
          repos.map((repo) => <ProjectCard key={repo.githubId} project={repo} />)
        ) : (
          !isLoading && <div className="col-span-full text-center py-20 text-gray-500">No projects found for this category.</div>
        )}
      </div>

      {showButton && (
        <div className="text-center mt-4">
          <button 
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-(--primary-button) hover:bg-(--primary-button-hover) px-6 py-2 rounded-md text-sm flex items-center gap-2 mx-auto disabled:opacity-50"
          >
            {isLoading ? "Fetching..." : "Load More"}
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default ProjectGrid;