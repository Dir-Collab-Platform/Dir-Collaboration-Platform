import React from 'react';

function RepositoryCard({ name, visibility, description, stars, updatedAt }) {
    return (
        // Main card container
        <div className="border-b border-gray-200 py-4 px-2 hover:bg-gray-50 transition-colors duration-200">
            
            {/* Title and visibility row */}
            <div className="flex items-center gap-2 mb-1">
                {/* Repository name */}
                <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
                    {name}
                </h3>
                
                {/* Visibility badge */}
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    visibility === 'public'
                        ? 'text-gray-600 border-gray-300 bg-gray-100'
                        : 'text-purple-600 border-purple-300 bg-purple-100'
                }`}>
                    {visibility}
                </span>
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {description}
            </p>
            
            {/* Footer: stars and updated time */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    ⭐ {stars}
                </span>
                <span>Updated {updatedAt}</span>
            </div>
        </div>
    );
}

export default RepositoryCard;