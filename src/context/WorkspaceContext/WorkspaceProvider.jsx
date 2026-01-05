import React, { useState, useEffect, createContext } from 'react';
import { WorkspaceContext } from './WorkspaceContext';

export default function WorkspaceProvider({ children }) {
    const [data, setData] = useState(null);
    const [activeFile, setActiveFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isEditingFile, setIsEditingFile] = useState(false);

    useEffect(() => {
        const fetchWorkspaceData = async () => {
            try {
                // Simulating a slight delay to ensure the loading state is visible and smooth
                // In production, you would remove this timeout
                await new Promise(resolve => setTimeout(resolve, 800));

                const response = await fetch('/data/workspace.json');
                if (!response.ok) throw new Error("Could not connect to the workspace server.");
                const json = await response.json();
                
                setData(json);
                
                // Default active file logic
                // if (json.contents && json.contents.length > 0) {
                //     const readme = json.contents.find(f => f.name.toLowerCase() === 'readme.md');
                //     setActiveFile(readme || json.contents[0]);
                // }
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkspaceData();
    }, []);

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
};