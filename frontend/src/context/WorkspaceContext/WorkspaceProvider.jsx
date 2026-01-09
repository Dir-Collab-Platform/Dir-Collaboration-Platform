import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { WorkspaceContext } from './WorkspaceContext';
import { apiRequest } from '../../services/api/api';

export default function WorkspaceProvider({ children }) {
    const { id: workspaceId } = useParams();
    const [data, setData] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isEditingFile, setIsEditingFile] = useState(false);

    // Chat-related state (consolidated from ChatProvider)
    const [channels, setChannels] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeChannelId, setActiveChannelId] = useState(null);

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

            // Set both loading states immediately
            if (isMounted) {
                setIsLoading(true);
                setIsLoadingFiles(true);
            }

            try {
                const isMongoId = /^[0-9a-fA-F]{24}$/.test(workspaceId);

                // ============================================================
                // STEP 1: INITIATE ALL 5 NETWORK REQUESTS SIMULTANEOUSLY
                // Workspace metadata, contents, languages, channels, members
                // All requests fly out at the same millisecond!
                // ============================================================
                const metaPromise = isMongoId
                    ? apiRequest(`/api/repos/${workspaceId}`)
                    : Promise.resolve({
                        status: 'success',
                        data: {
                            id: repoPreview.githubId,
                            _id: null,
                            name: repoPreview.githubRepoName,
                            full_name: repoPreview.githubFullName,
                            private: false,
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
                            members: []
                        }
                    });

                const backgroundPromise = isMongoId
                    ? Promise.all([
                        apiRequest(`/api/repos/contents?workspaceId=${workspaceId}`),
                        apiRequest(`/api/repos/languages?workspaceId=${workspaceId}`),
                        apiRequest(`/api/repos/${workspaceId}/channels`),
                        apiRequest(`/api/repos/${workspaceId}/members`)
                    ])
                    : Promise.all([
                        apiRequest(`/api/repos/contents?owner=${repoPreview?.githubOwner}&repo=${repoPreview?.githubRepoName}`),
                        apiRequest(`/api/repos/languages?owner=${repoPreview?.githubOwner}&repo=${repoPreview?.githubRepoName}`),
                        Promise.resolve({ status: 'success', data: [] }), // No channels for preview
                        Promise.resolve({ status: 'success', data: [] })  // No members for preview
                    ]);

                // ============================================================
                // 🎯 STEP 2: WAIT ONLY FOR THE TINY METADATA TO SHOW THE UI
                // ============================================================
                const repoRes = await metaPromise;
                if (!isMounted) return;
                if (repoRes.status !== 'success') {
                    throw new Error(repoRes.message || 'Failed to fetch workspace data');
                }

                const repoData = repoRes.data;

                // Immediately populate basic repository info
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
                        isImported: !!repoData._id,
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
                    files: [],
                    contents: [],
                    languages: [],
                    last_commit: null,
                    stats: { forks: 0, stars: 0, watchers: 0 }
                });

                // 🎯 UNBLOCK MAIN UI NOW - "Syncing repository" spinner disappears!
                if (isMounted) setIsLoading(false);

                // ============================================================
                // STEP 3: SILENTLY FILL IN ALL BACKGROUND DATA
                // Files, languages, channels, and members are already in flight!
                // ============================================================
                const [contentsRes, langRes, channelsRes, membersRes] = await backgroundPromise;
                if (!isMounted) return;

                // Silent update: Merge files and languages into existing state
                const files = contentsRes?.status === 'success' ? (contentsRes.files || contentsRes.data || []) : [];
                const languagesData = langRes?.status === 'success' ? langRes.data : [];

                setData(prev => ({
                    ...prev,
                    files: files,
                    contents: files,
                    languages: languagesData
                }));

                // Set active file if files are available
                if (files.length > 0 && isMounted) {
                    const readme = files.find(f => f.name.toLowerCase() === 'readme.md');
                    setActiveFile(readme || files[0]);
                }

                // Process chat channels
                if (channelsRes?.status === 'success') {
                    const list = channelsRes.data || [];
                    const normalizedChannels = list.map(ch => ({
                        ...ch,
                        _id: ch.channel_id || ch._id,
                        channel_id: ch.channel_id || ch._id
                    }));
                    setChannels(normalizedChannels);

                    if (list.length > 0) {
                        setActiveChannelId(list[0].channel_id || list[0]._id);
                    }
                }

                // Process chat members
                if (membersRes?.status === 'success') {
                    setUsers(membersRes.data.map(m => ({
                        _id: m.userId?._id || m.userId,
                        githubUsername: m.userId?.githubUsername || m.userId?.username,
                        avatarUrl: m.userId?.avatarUrl,
                        role: m.role
                    })));
                }

                if (isMounted) setIsLoadingFiles(false);

            } catch (err) {
                if (isMounted) {
                    setError(err.message || 'Failed to load workspace. Please check your connection and try again.');
                    setIsLoading(false);
                    setIsLoadingFiles(false);
                    console.error('Failed to fetch workspace data:', err);
                }
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
    const importRepo = async (workspaceName, description) => {
        if (!data?.repository) return;

        try {
            setIsLoading(true);
            const res = await apiRequest('/api/repos/create-workspace', {
                method: 'POST',
                body: JSON.stringify({
                    githubRepoName: data.repository.name,
                    workspaceName: workspaceName,
                    description: description || data.repository.description
                })
            });

            if (res.status === 'success') {
                // Successfully imported/created workspace
                // Refresh or redirect
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
        isLoadingFiles,
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
        // Chat-related data (consolidated from ChatProvider)
        channels,
        setChannels,
        users,
        setUsers,
        activeChannelId,
        setActiveChannelId
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
}
