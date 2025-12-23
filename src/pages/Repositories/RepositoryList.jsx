import { useState } from 'react';
import RepositoryCard from './RepositoryCard';
import MOCK_REPOS from '../../../mock-backend/repositories.json';

function RepositoryList() {
    // Search state for filtering repositories
    const [searchTerm, setSearchTerm] = useState("");
    
    // Filter repositories based on search input
    const filteredRepos = MOCK_REPOS.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* USER PROFILE HEADER - Shows avatar, name, and statistics */}
            <header className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    {/* Left: User avatar and basic info */}
                    <div className="flex items-center gap-4">
                        <img 
                            src="https://via.placeholder.com/60" 
                            alt="Profile" 
                            className="rounded-full w-14 h-14"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">Zeamanuel Mebit</h2>
                            <span className="text-gray-500">@zeaman</span>
                        </div>
                    </div>
                    
                    {/* Right: Repository and star statistics */}
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-2xl">📁</div>
                            <div className="text-sm text-gray-600">Repositories</div>
                            <div className="font-bold">{filteredRepos.length}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl">⭐</div>
                            <div className="text-sm text-gray-600">Stars</div>
                            <div className="font-bold">50</div>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-300" />
            </header>

            {/* SEARCH INPUT - Filters repository list in real-time */}
            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Search for Repositories..." 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* REPOSITORY CARDS LIST - Displays all filtered repositories */}
            <div className="space-y-0">
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

        </div>
    );
}

export default RepositoryList;