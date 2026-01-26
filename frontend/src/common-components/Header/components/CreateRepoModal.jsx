import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RepositoriesContext } from '../../../context/RepositoriesContext/RepositoriesContext';
import { X } from 'lucide-react';

function CreateRepoModal({ onClose }) {
  const { createRepository } = useContext(RepositoriesContext);
  const navigate = useNavigate();

  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [readme, setReadme] = useState('no');
  const [gitignore, setGitignore] = useState('no');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateRepository = async (e) => {
    if (e) e.preventDefault();

    if (!repoName.trim()) {
      setError("Please enter a repository name");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newRepo = await createRepository({
        name: repoName,
        description,
        isPrivate: visibility, // Backend expects "private" string
        auto_init: readme === 'yes' ? 'Yes' : 'No',
        gitignore_template: gitignore === 'yes' ? 'Yes' : 'No',
        isImport: false
      });

      // alert(`Repository "${newRepo.workspaceName}" created successfully!`); // Optional success message
      handleClose();
      // Redirect to the new workspace
      navigate(`/workspace/${newRepo._id}`);

    } catch (err) {
      console.error("Creation failed:", err);
      // Display specific backend error message
      setError(err.message || "Failed to create repository");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRepoName('');
    setDescription('');
    setVisibility('private');
    setReadme('no');
    setGitignore('no');
    onClose();
  };

  const handleOptionChange = (optionType, value) => {
    switch (optionType) {
      case 'visibility':
        setVisibility(value);
        break;
      case 'readme':
        setReadme(value);
        break;
      case 'gitignore':
        setGitignore(value);
        break;
      default:
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/70"
      onClick={handleClose}
    >
      <div
        className="rounded-xl w-full max-w-md overflow-hidden bg-(--dark-bg) border border-(--main-border-color)"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="p-6 border-b flex justify-between items-center border-(--main-border-color)"
        >
          <div className="w-6"></div>

          <h2 className="text-lg font-semibold flex-1 text-center text-(--primary-text-color)">
            Create New Repository
          </h2>

          <button
            className="p-1 rounded w-6 flex items-center justify-center text-(--secondary-text-color)"
            onClick={handleClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateRepository}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-(--primary-text-color)">
                Repository name
              </label>
              <input
                type="text"
                placeholder="My repository..."
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--active-text-color)] focus:border-transparent bg-[#303036] border border-(--main-border-color)"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-(--primary-text-color)">
                Description
              </label>
              <input
                type="text"
                placeholder="The repo is..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--active-text-color)] focus:border-transparent bg-[#303036] border border-(--main-border-color)"
              />
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--primary-text-color)">
                  Choose Visibility
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-20 mr-8 ${visibility === 'public' ? 'text-white bg-[#1D1D29]' : 'text-gray-400 hover:text-white bg-(--secondary-button)'}`}
                    onClick={() => handleOptionChange('visibility', 'public')}
                  >
                    Public
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-20 mr-8 ${visibility === 'private' ? 'text-white bg-[#1D1D29]' : 'text-gray-400 hover:text-white bg-(--secondary-button)'}`}
                    onClick={() => handleOptionChange('visibility', 'private')}
                  >
                    Private
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--primary-text-color)">
                  Add README
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-20 mr-8 ${readme === 'yes' ? 'text-white bg-[#1D1D29]' : 'text-gray-400 hover:text-white bg-(--secondary-button)'}`}
                    onClick={() => handleOptionChange('readme', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-20 mr-8 ${readme === 'no' ? 'text-white bg-[#1D1D29]' : 'text-gray-400 hover:text-white bg-(--secondary-button)'}`}
                    onClick={() => handleOptionChange('readme', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--primary-text-color)">
                  Add .gitignore
                </label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-20 mr-8 ${gitignore === 'yes' ? 'text-white bg-[#1D1D29]' : 'text-gray-400 hover:text-white bg-(--secondary-button)'}`}
                    onClick={() => handleOptionChange('gitignore', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-20 mr-8 ${gitignore === 'no' ? 'text-white bg-[#1D1D29]' : 'text-gray-400 hover:text-white bg-(--secondary-button)'}`}
                    onClick={() => handleOptionChange('gitignore', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-semibold transition-colors bg-(--primary-button) text-(--primary-text-color) ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:bg-(--primary-button-hover) pointer'}`}
              >
                {isSubmitting ? 'Creating...' : 'Create Repository'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateRepoModal;