import React ,{useState} from 'react';
import './RepositoryList.css';
import RepositoryCard from '../Repositories/RepositoryCard';
import MOCK_REPOS from '../../../../mock-backend/repositories.json';
//define component
function RepositoryList() {
    //initialize state

    const [searchTerm, setSearchTerm] = useState("");
    
    //filter logic : create list of repo name which only contains what the user typed
    const filteredRepos = MOCK_REPOS.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <div className="repo-list-container">
        {/* HEADER SECTION */}
            <div className="profile-header">
                <div className="user-info">
                    <img 
                        src="https://via.placeholder.com/60" 
                        alt="Profile" 
                        className="avatar" 
                    />
                    <div className="user-details">
                        <h2 className="display-name">Zeamanuel Meabit</h2>
                        <span className="username">@zeaman</span>
                    </div>
                </div>
           {/*User statstics */}
                <div className="user-stats">
                    <div className="stat-item">
                        <span className="stat-icon">📁</span>
                        <span className="stat-label">Repositories</span>
                        <span className="stat-count">{filteredRepos.length}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span className="stat-label">Stars</span>
                        <span className="stat-count">50</span>
                    </div>
                </div>
            </div>
            <hr className="header-divider" />

         {/* Search input */}

            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search for Repositories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
           
        {/* loop over filtered data */}

            {filteredRepos.map((repo) => (
                <RepositoryCard 
                    key={repo.id} 
                    name={repo.name}
                    visibility={repo.visibility}
                    description={repo.description}
                    stars={repo.stars}
                    updatedAt={repo.updatedAt}
                />
            ))}
        </div>
    );
}
export default RepositoryList;
