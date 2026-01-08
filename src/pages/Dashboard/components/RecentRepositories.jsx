import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateRepoModal from '../../../common-components/Header/components/CreateRepoModal';
import { mockRepositories } from '../../../data/mockData';

const RecentRepositories = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const repos = mockRepositories.slice(0, 3);

  return (
    <>
      <div className="bg-[#1D1D29] rounded-xl p-8 border border-white/5 h-full">
        <h3 className="text-xl font-bold text-white mb-8">Quick Access</h3>
        <div className="space-y-6 mb-10">
          {repos.map((repo, i) => (
            <div
              key={repo._id || i}
              onClick={() => navigate(`/workspace/${repo._id}`)}
              className="flex justify-between items-center group cursor-pointer"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{repo.githubRepoName || repo.name}</p>
                <p className="text-xs text-gray-500 truncate">{repo.description}</p>
              </div>
              <ExternalLink size={18} className="text-gray-500 group-hover:text-white shrink-0" />
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