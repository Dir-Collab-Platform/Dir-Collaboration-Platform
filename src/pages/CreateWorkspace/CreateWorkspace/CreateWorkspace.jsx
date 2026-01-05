import { useState } from 'react';

const CreateWorkspace = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('contributor');
  const [workspaceName, setWorkspaceName] = useState('');
  const [description, setDescription] = useState('');
  const [repoName, setRepoName] = useState('');

  const handleOpenModal = () => {
    console.log("Opening invite modal");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setSearchInput('');
  };

  const handleSendInvite = () => {
    if (!searchInput.trim()) {
      alert("Please enter a collaborator username");
      return;
    }
    
    console.log(`Sending invite to: ${searchInput} as ${selectedRole}`);
    alert(`Invitation sent to ${searchInput} as ${selectedRole}`);
    handleCloseModal();
  };

  const handleCreateWorkspace = (e) => {
    if (e) e.preventDefault();
    
    if (!workspaceName.trim()) {
      alert("Please enter a workspace name");
      return;
    }
    
    if (!repoName.trim()) {
      alert("Please enter a repository name");
      return;
    }
    
    console.log(`Creating workspace: ${workspaceName} with repo: ${repoName}`);
    alert(`Workspace "${workspaceName}" created successfully!`);
    
    // Reset form
    setWorkspaceName('');
    setDescription('');
    setRepoName('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchInput.trim() && isModalOpen) {
      handleSendInvite();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-5">
      <div className="bg-[var(--dimmer-dark-bg)] py-8 px-12 rounded-xl w-full max-w-[600px] flex flex-col gap-6 shadow-lg border border-[var(--main-border-color)]">
        <h1 className="text-1.4rem text-center mb-0.5">Create New Workspace</h1>
        <hr className="w-4/5 mx-auto mb-6 border border-[var(--main-border-color)]" />
        
        <form onSubmit={handleCreateWorkspace}>
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="workspaceName" className="text-[0.95rem] font-medium">Workspace name</label>
            <input 
              type="text" 
              placeholder="My workspace.." 
              id="workspaceName"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
              className="py-2 px-3 border border-[var(--main-border-color)] rounded-md bg-[#303036] text-[var(--primary-text-color)] text-[0.95rem] font-[var(--main-font-family)] focus:outline-none focus:border-[var(--active-text-color)]"
            />
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="descriptionWorkspace" className="text-[0.95rem] font-medium">Description</label>
            <textarea 
              id="descriptionWorkspace"
              placeholder="This workspace is ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="py-2 px-3 border border-[var(--main-border-color)] rounded-md bg-[#303036] text-[var(--primary-text-color)] text-[0.95rem] font-[var(--main-font-family)] focus:outline-none focus:border-[var(--active-text-color)] h-20"
            />
          </div>
          
          <div className="flex flex-col gap-2 mb-4">
            <label htmlFor="workingRepository" className="text-[0.95rem] font-medium">Working Repository</label>
            <input 
              type="text" 
              id="workingRepository" 
              placeholder="Repo name..."
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              required
              className="py-2 px-3 border border-[var(--main-border-color)] rounded-md bg-[#303036] text-[var(--primary-text-color)] text-[0.95rem] font-[var(--main-font-family)] focus:outline-none focus:border-[var(--active-text-color)]"
            />
          </div>
          
          <div className="flex gap-4 mb-6">
            <button 
              type="button" 
              className="flex-1 py-2.5 px-4 bg-[#1D1D29] text-[var(--primary-text-color)] border-none rounded-md cursor-pointer flex items-center justify-center gap-2 font-medium font-[var(--main-font-family)] hover:opacity-90 w-full"
              onClick={handleOpenModal}
            >
              Invite Collaborators
            </button>
            <button type="button" className="flex-1 py-2.5 px-4 bg-[#1D1D29] text-[var(--primary-text-color)] border-none rounded-md cursor-pointer flex items-center justify-center gap-2 font-medium font-[var(--main-font-family)] hover:opacity-90 w-full">
              <span className="plus-icon text-lg">+</span>Add Channel
            </button>
          </div>
          
          <div className="flex justify-center mt-4">
            <button type="submit" className="py-3 px-8 bg-[var(--primary-button)] text-[var(--primary-text-color)] border-none rounded-lg cursor-pointer font-semibold text-base font-[var(--main-font-family)] hover:bg-[var(--primary-button-hover)]">
              Create Workspace
            </button>
          </div>
        </form>
      </div>

      {/* Invite Collaborators Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000] backdrop-blur-sm animate-[fadeIn_0.3s_ease]"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-[var(--dimmer-dark-bg)] rounded-xl w-full max-w-[480px] overflow-hidden border border-[var(--main-border-color)] animate-[slideUp_0.3s_ease] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-6 px-6 text-center">
              <h2 className="text-xl text-[var(--primary-text-color)] mb-2">Invite Collaborators</h2>
              <p className="text-sm text-[var(--secondary-text-color)] m-0">Search by Username, Full name or Email</p>
            </div>
            
            <div className="pb-6 px-6 flex flex-col gap-4">
              <div className="w-full">
                <div className="w-full">
                  <input 
                    type="text" 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Collaborator username"
                    className="w-full py-3 px-4 bg-[#303036] border border-[var(--main-border-color)] rounded-lg text-[var(--primary-text-color)] font-[var(--main-font-family)] text-[0.95rem] focus:outline-none focus:border-[var(--active-text-color)]"
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-base text-[var(--primary-text-color)] mb-3">Role</h3>
                {/* Only HR line after Role title */}
                <hr className="border-none border-t border-[var(--main-border-color)] mb-4" />
                {/* Removed gap between radio buttons */}
                <div className="flex flex-row">
                  <label className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200">
                    <input 
                      type="radio" 
                      name="role" 
                      value="owner" 
                      checked={selectedRole === 'owner'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRole === 'owner' ? 'border-[#BE2D2DE5]' : 'border-[var(--main-border-color)]'}`}>
                      {selectedRole === 'owner' && <div className="w-2 h-2 rounded-full bg-[#BE2D2DE5]"></div>}
                    </div>
                    <span className={`text-[var(--primary-text-color)] text-[0.95rem] font-medium cursor-pointer ${selectedRole === 'owner' ? 'text-[#BE2D2DE5]' : ''}`}>
                      Owner
                    </span>
                  </label>
                  <label className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200">
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={selectedRole === 'admin'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRole === 'admin' ? 'border-[#BE2D2DE5]' : 'border-[var(--main-border-color)]'}`}>
                      {selectedRole === 'admin' && <div className="w-2 h-2 rounded-full bg-[#BE2D2DE5]"></div>}
                    </div>
                    <span className={`text-[var(--primary-text-color)] text-[0.95rem] font-medium cursor-pointer ${selectedRole === 'admin' ? 'text-[#BE2D2DE5]' : ''}`}>
                      Admin
                    </span>
                  </label>
                  <label className="flex items-center gap-3 py-3 px-4 rounded-lg cursor-pointer transition-all duration-200">
                    <input 
                      type="radio" 
                      name="role" 
                      value="contributor" 
                      checked={selectedRole === 'contributor'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="hidden"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedRole === 'contributor' ? 'border-[#BE2D2DE5]' : 'border-[var(--main-border-color)]'}`}>
                      {selectedRole === 'contributor' && <div className="w-2 h-2 rounded-full bg-[#BE2D2DE5]"></div>}
                    </div>
                    <span className={`text-[var(--primary-text-color)] text-[0.95rem] font-medium cursor-pointer ${selectedRole === 'contributor' ? 'text-[#BE2D2DE5]' : ''}`}>
                      Contributor
                    </span>
                  </label>
                </div>
              </div>

              {/* Both buttons with primary-button color and hover */}
              <div className="flex flex-row gap-3 mt-4">
                <button 
                  className="flex-1 py-3.5 bg-[var(--primary-button)] text-[var(--primary-text-color)] border-none rounded-lg cursor-pointer font-semibold text-[0.95rem] font-[var(--main-font-family)] hover:bg-[var(--primary-button-hover)]"
                  onClick={handleSendInvite}
                  type="button"
                >
                  Invite Collaborators
                </button>
                <button 
                  className="flex-1 py-3.5 bg-[var(--primary-button)] text-[var(--primary-text-color)] border-none rounded-lg cursor-pointer font-medium text-[0.95rem] font-[var(--main-font-family)] hover:bg-[var(--primary-button-hover)]"
                  onClick={handleCloseModal}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add these styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .text-1\.4rem {
          font-size: 1.4rem;
        }
        
        .animate-\[fadeIn_0\.3s_ease\] {
          animation: fadeIn 0.3s ease;
        }
        
        .animate-\[slideUp_0\.3s_ease\] {
          animation: slideUp 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default CreateWorkspace;