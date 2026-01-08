import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { WorkspaceContext } from './WorkspaceContext';
import { mockWorkspaces, mockUsers, mockRepositoryContents, mockLanguages } from '../../data/mockData';

export default function WorkspaceProvider({ children }) {
    const { id: workspaceId } = useParams();
    const [data, setData] = useState(null);
    const [activeFile, setActiveFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isEditingFile, setIsEditingFile] = useState(false);

    useEffect(() => {
        const fetchWorkspaceData = async () => {
            if (!workspaceId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                // TODO: Replace with real API call when integrating backend
                // const response = await axios.get(`/api/repos/${workspaceId}`);
                // const workspaceData = response.data.data;
                // setData(workspaceData);
                
                // Mock implementation
                await new Promise(resolve => setTimeout(resolve, 800));
                const workspace = mockWorkspaces.find(ws => ws._id === workspaceId);
                
                if (!workspace) {
                    throw new Error("Workspace not found");
                }

                // Get repository contents (files) from mock data
                const files = mockRepositoryContents[workspaceId] || [];
                
                // Get languages from mock data
                const languagesData = mockLanguages[workspaceId] || [];
                
                // Transform workspace data to match expected structure
                setData({
                    repository: {
                        id: workspace.githubId,
                        name: workspace.githubRepoName,
                        full_name: workspace.githubFullName,
                        private: workspace.isPrivate,
                        owner: {
                            login: workspace.githubOwner,
                            avatar_url: mockUsers.find(u => u._id === workspace.ownerId)?.avatarUrl || ""
                        },
                        description: workspace.description,
                        html_url: workspace.url,
                        language: workspace.language,
                        default_branch: "main",
                        topics: workspace.tags || []
                    },
                    files: files, // Files with plain text content
                    contents: files, // Alias for compatibility
                    languages: languagesData, // Languages in API format: [{ label, value, color }]
                    last_commit: {
                        sha: "4ed6gh78291077221b6d0130938291",
                        commit: {
                            author: {
                                name: workspace.githubOwner,
                                date: workspace.updatedAt
                            },
                            message: "Latest commit",
                            comment_count: 0
                        },
                        author: {
                            login: workspace.githubOwner
                        }
                    },
                    stats: {
                        forks: 0,
                        stars: 0,
                        watchers: 0
                    }
                });
                
                // Set default active file (README.md or first file)
                if (files.length > 0) {
                    const readme = files.find(f => f.name.toLowerCase() === 'readme.md');
                    setActiveFile(readme || files[0]);
                }
            } catch (err) {
                setError(err.message);
                console.error('Failed to fetch workspace data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspaceData();
    }, [workspaceId]);

    const value = {
        repository: data?.repository,
        contents: data?.contents,
        languages: data?.languages,
        lastCommit: data?.last_commit,
        stats: data?.stats,
        activeFile,
        setActiveFile,
        isLoading,
        error,
        isSidebarOpen,
        setIsSidebarOpen,
        isEditingFile,
        setIsEditingFile
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
