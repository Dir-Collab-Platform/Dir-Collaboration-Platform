import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { WorkspaceContext } from './WorkspaceContext';
import { apiRequest } from '../../services/api/api';

export default function WorkspaceProvider({ children }) {
    const { id: workspaceId } = useParams();
    const [data, setData] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isEditingFile, setIsEditingFile] = useState(false);

    const location = useLocation();
    const repoPreview = location.state?.repoData; // Repo data passed from list if not imported

    useEffect(() => {
        let isMounted = true;

        const fetchWorkspaceData = async () => {
            if (!workspaceId || workspaceId === 'undefined') {
                if (isMounted) {
                    setError('Invalid workspace ID');
                    setIsLoading(false);
                }
                return;
            }

            if (isMounted) setIsLoading(true);

            try {
                // Check if it's a valid Mongo ObjectId (24 hex chars)
                const isMongoId = /^[0-9a-fA-F]{24}$/.test(workspaceId);

                let repoData, contentsRes, langRes;

                if (isMongoId) {
                    // 1. Valid DB Workspace: Fetch from API
                    const [repoRes, cRes, lRes] = await Promise.all([
                        apiRequest(`/api/repos/${workspaceId}`),
                        apiRequest(`/api/repos/contents?workspaceId=${workspaceId}`),
                        apiRequest(`/api/repos/languages?workspaceId=${workspaceId}`).catch(() => ({ status: 'success', data: [] }))
                    ]);
                    
                    if (repoRes.status !== 'success') {
                        throw new Error(repoRes.message || 'Failed to fetch workspace data');
                    }
                    
                    repoData = repoRes.data;
                    contentsRes = cRes;
                    langRes = lRes;
                } else if (repoPreview) {
                    // 2. GitHub Preview (Not imported): Use passed state + GitHub API proxy
                    repoData = {
                        // Map GitHub preview data to expected Workspace format
                        id: repoPreview.githubId,
                        _id: null, // No DB ID
                        name: repoPreview.githubRepoName,
                        full_name: repoPreview.githubFullName,
                        private: false, // Default assumption or from preview data
                        owner: {
                            login: repoPreview.githubOwner,
                            avatar_url: ""
                        },
                        description: repoPreview.description,
                        html_url: repoPreview.url,
                        language: repoPreview.language,
                        isImported: false,
                        default_branch: "main",
                        topics: [],
                        members: [] // No members for preview
                    };

                    // Fetch contents using Owner/Repo
                    const [cRes, lRes] = await Promise.all([
                        apiRequest(`/api/repos/contents?owner=${repoPreview.githubOwner}&repo=${repoPreview.githubRepoName}`),
                        apiRequest(`/api/repos/languages?owner=${repoPreview.githubOwner}&repo=${repoPreview.githubRepoName}`).catch(() => ({ status: 'success', data: [] }))
                    ]);
                    contentsRes = cRes;
                    langRes = lRes;
                } else {
                    throw new Error("Repository not found (and no preview data provided)");
                }

                if (!isMounted) return;

                // Common Processing
                const files = contentsRes.status === 'success' && contentsRes.type === 'dir' ? contentsRes.files : [];
                const languagesData = langRes.status === 'success' ? langRes.data : [];

                setData({
                    repository: {
                        id: repoData.githubId || repoData.id,
                        _id: repoData._id,
                        name: repoData.workspaceName || repoData.name,
                        full_name: repoData.githubFullName || repoData.full_name,
                        private: repoData.isPrivate,
                        owner: {
                            login: repoData.githubOwner || repoData.owner?.login,
                            avatar_url: repoData.owner?.avatar_url || ""
                        },
                        description: repoData.description,
                        html_url: repoData.url || repoData.html_url,
                        language: repoData.language,
                        isImported: !!repoData._id, // If it has a DB ID, it's imported
                        stars: 0,
                        default_branch: "main",
                        topics: repoData.tags || [],
                        members: (repoData.members || []).map(mem => ({
                            id: mem.userId?._id || mem.userId,
                            name: mem.userId?.githubUsername || "Unknown user",
                            avatar: mem.userId?.avatarUrl,
                            role: mem.role
                        }))
                    },
                    files: files,
                    contents: files,
                    languages: languagesData,
                    last_commit: null, // No commit data for now
                    stats: { forks: 0, stars: 0, watchers: 0 }
                });

                if (files.length > 0) {
                    const readme = files.find(f => f.name.toLowerCase() === 'readme.md');
                    setActiveFile(readme || files[0]);
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err.message || 'Failed to load workspace. Please check your connection and try again.';
                    setError(errorMessage);
                    console.error('Failed to fetch workspace data:', err);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchWorkspaceData();

        return () => {
            isMounted = false;
        };
    }, [workspaceId, repoPreview]);

    /**
     * Fetch contents of a specific folder path and update the tree
     * @param {string} folderPath - The path of the folder to fetch
     */
    const fetchFolderContents = async (folderPath) => {
        if (!data?.repository) return [];

        try {
            const { repository } = data;
            const isImported = !!repository._id;

            let contentsRes;
            if (isImported) {
                contentsRes = await apiRequest(`/api/repos/contents?workspaceId=${repository._id}&path=${encodeURIComponent(folderPath)}`);
            } else {
                contentsRes = await apiRequest(`/api/repos/contents?owner=${repository.owner?.login}&repo=${repository.name}&path=${encodeURIComponent(folderPath)}`);
            }

            if (contentsRes.status === 'success' && contentsRes.type === 'dir') {
                return contentsRes.files || [];
            }
            return [];
        } catch (err) {
            console.error('Failed to fetch folder contents:', err);
            return [];
        }
    };

    /**
     * Update a folder node's children in the contents tree
     */
    const setFolderChildren = (folderPath, children) => {
        setData(prev => {
            if (!prev) return prev;

            const updateChildren = (items) => {
                return items.map(item => {
                    if (item.path === folderPath) {
                        return { ...item, children };
                    }
                    if (item.children) {
                        return { ...item, children: updateChildren(item.children) };
                    }
                    return item;
                });
            };

            return {
                ...prev,
                contents: updateChildren(prev.contents || [])
            };
        });
    };

    /**
     * Fetch file content and set as active file
     * @param {Object} file - The file object with path, name, type, sha
     */
    const [isLoadingFile, setIsLoadingFile] = useState(false);

    const selectFile = async (file) => {
        if (!file || file.type === 'dir') return;

        // If file already has content, just set it as active
        if (file.content) {
            setActiveFile(file);
            return;
        }

        // Fetch file content from API
        setIsLoadingFile(true);
        try {
            const { repository } = data || {};
            if (!repository) {
                throw new Error('Repository data not available');
            }

            const isImported = !!repository._id;
            let contentsRes;

            if (isImported) {
                contentsRes = await apiRequest(`/api/repos/contents?workspaceId=${repository._id}&path=${encodeURIComponent(file.path)}`);
            } else {
                contentsRes = await apiRequest(`/api/repos/contents?owner=${repository.owner?.login}&repo=${repository.name}&path=${encodeURIComponent(file.path)}`);
            }

            if (contentsRes.status === 'success' && contentsRes.type === 'file') {
                // Backend returns fileData with content already decoded
                const fileWithContent = {
                    ...file,
                    content: contentsRes.fileData?.content || '',
                    sha: contentsRes.fileData?.sha || file.sha,
                    size: contentsRes.fileData?.size || file.size
                };
                setActiveFile(fileWithContent);
            } else {
                // Fallback: set file without content
                setActiveFile(file);
            }
        } catch (err) {
            console.error('Failed to fetch file content:', err);
            setActiveFile(file); // Set file anyway, viewer will handle missing content
        } finally {
            setIsLoadingFile(false);
        }
    };

    /**
     * Delete a file
     */
    const deleteFile = async (file) => {
        if (!data?.repository?._id || !file?.path || !file?.sha) {
            throw new Error('Missing required data for deletion');
        }

        try {
            const res = await apiRequest(`/api/repos/${data.repository._id}/contents`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    path: file.path,
                    sha: file.sha,
                    commitMessage: `Delete ${file.name}`
                })
            });

            if (res.status === 'success') {
                // Determine parent folder path to refresh
                const pathParts = file.path.split('/');
                pathParts.pop(); // Remove file name
                const parentPath = pathParts.join('/');

                // Refresh parent folder contents if we have the function and it's not root
                if (parentPath && fetchFolderContents && setFolderChildren) {
                    const children = await fetchFolderContents(parentPath);
                    setFolderChildren(parentPath, children);
                } else if (setFolderChildren) {
                    // Optimization: If it's root or we want to force refresh, we might need a fetchRoot function
                    // For now, simpler to just close the file if it was active
                }

                if (activeFile?.path === file.path) {
                    setActiveFile(null);
                }
                return true;
            }
            throw new Error(res.message || 'Failed to delete file');
        } catch (err) {
            console.error("Delete File Error:", err);
            throw err;
        }
    };

    /**
     * Invite a member to the workspace
     */
    const inviteMember = async (githubUsername, role = 'editor') => {
        if (!data?.repository?._id) return;

        try {
            const res = await apiRequest(`/api/repos/${data.repository._id}/members`, {
                method: 'POST',
                body: JSON.stringify({ githubUsername, role }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status === 'success') {
                // Update local state
                setData(prev => ({
                    ...prev,
                    repository: {
                        ...prev.repository,
                        members: res.data || prev.repository.members
                    }
                }));
                return true;
            }
            throw new Error(res.message || 'Failed to invite member');
        } catch (err) {
            console.error('Invite Member Error:', err);
            throw err;
        }
    };

    /**
     * Remove a member from the workspace
     */
    const removeMember = async (userId) => {
        if (!data?.repository?._id) return;

        try {
            const res = await apiRequest(`/api/repos/${data.repository._id}/members/${userId}`, {
                method: 'DELETE'
            });

            if (res.status === 'success') {
                // Update local state
                setData(prev => ({
                    ...prev,
                    repository: {
                        ...prev.repository,
                        members: prev.repository.members.filter(m => {
                            const mUserId = m.userId?._id || m.userId; // handle populated/non-populated
                            return mUserId !== userId;
                        })
                    }
                }));
                return true;
            }
            throw new Error(res.message || 'Failed to remove member');
        } catch (err) {
            console.error('Remove Member Error:', err);
            throw err;
        }
    };

    /**
     * Import a repository (create workspace from existing GitHub repo)
     */
    /**
     * Import a repository (create workspace from existing GitHub repo)
     */
    const importRepo = async (workspaceName, description) => {
        if (!data?.repository) return;

        try {
            setIsLoading(true);
            
            const payload = {
                githubId: data.repository.id.toString(),
                githubRepoName: data.repository.name,
                githubOwner: data.repository.owner?.login,
                githubFullName: data.repository.full_name,
                workspaceName: workspaceName,
                description: description || data.repository.description,
                url: data.repository.html_url,
                language: data.repository.language
            };

            const res = await apiRequest('/api/repos/import', {
                method: 'POST',
                body: payload
            });

            if (res.status === 'success' || res.status === 'created') {
                // Successfully imported/created workspace
                return res.data;
            }
            throw new Error(res.message || 'Failed to import repository');
        } catch (err) {
            console.error('Import Repo Error:', err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        repository: data?.repository,
        contents: data?.contents,
        languages: data?.languages,
        lastCommit: data?.last_commit,
        stats: data?.stats,
        activeFile,
        setActiveFile: selectFile,
        isLoading,
        isLoadingFile,
        error,
        isSidebarOpen,
        setIsSidebarOpen,
        isEditingFile,
        setIsEditingFile,
        fetchFolderContents,
        setFolderChildren,
        deleteFile,
        inviteMember,
        removeMember,
        importRepo
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
