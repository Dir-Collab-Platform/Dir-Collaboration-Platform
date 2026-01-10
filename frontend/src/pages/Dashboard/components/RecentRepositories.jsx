import React, { useState, useContext } from 'react';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateRepoModal from '../../../common-components/Header/components/CreateRepoModal';
import { DashboardContext } from '../../../context/DashboardContext/DashboardContext';

const RecentRepositories = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { recentRepos } = useContext(DashboardContext);

  const repos = recentRepos || [];

  return (
    <>
      <div className="bg-(--bg-card) rounded-xl p-8 border border-white/5 h-fit shadow-sm">
        <h3 className="text-xl font-bold text-(--text-primary) mb-8">Quick Access</h3>
        <div className="space-y-6 mb-10">
          {repos.map((repo, i) => (
            <div
              key={repo._id || i}
              onClick={() => repo._id && navigate(`/workspace/${repo._id}`)}
              className="flex justify-between items-center group cursor-pointer"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-bold text-(--text-primary) group-hover:text-indigo-400 transition-colors truncate">{repo.githubRepoName || repo.name}</p>
                <p className="text-xs text-(--text-dim) truncate">{repo.description}</p>
              </div>
              <ExternalLink size={18} className="text-(--text-dim) group-hover:text-(--text-active) shrink-0" />
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 bg-[#2D2D3F] hover:bg-[#3D3D5F] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Create New Repository
        </button>
      </div>

      {showModal && (
        <CreateRepoModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default RecentRepositories;