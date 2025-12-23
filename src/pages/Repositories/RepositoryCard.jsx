import React from 'react';
{/* Define the component */}

function RepositoryCard({name , visibility , description , stars , updatedAt}){
    return(
        <div className="repo-card">

            {/*title and visibilty */}

            <div className="repo-card-header">
                <h3 className="repo-name">{name}</h3>
                <span className="repo-visibility">{visibility}</span>
            </div>
            
             {/*description */}

            <p className="repo-description">{description}</p>
            
            {/*repo stars and updated time */}

            <div className="repo-card-footer">
                <span className="repo-stars">⭐{stars}</span>
                <span className="repo-update">{updatedAt}</span>
            </div>
        </div>
    )
}
export default RepositoryCard;