import { useState, useContext, useMemo } from 'react'
import { ChevronRight, FileText, Folder, FolderOpen, Search, X } from 'lucide-react'
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'

function FileItem({ item, depth = 0, searchTerm = "" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoadingChildren, setIsLoadingChildren] = useState(false)
    const context = useContext(WorkspaceContext)

    if (!context) return null
    const { activeFile, setActiveFile, fetchFolderContents, setFolderChildren } = context

    const isFolder = item.type === 'dir'
    const isSelected = activeFile?.path === item.path

    // Automatically expand folders if there is an active search and the folder contains matches
    const hasSearchMatch = useMemo(() => {
        if (!searchTerm) return false
        const searchLower = searchTerm.toLowerCase()

        const checkMatch = (node) => {
            if (node.name.toLowerCase().includes(searchLower)) return true
            if (node.children) return node.children.some(checkMatch)
            return false
        }

        return isFolder && checkMatch(item)
    }, [item, searchTerm, isFolder])

    const handleClick = async () => {
        if (isFolder) {
            const willOpen = !isOpen
            setIsOpen(willOpen)

            // Lazy-load folder contents if opening and not already loaded
            if (willOpen && !item.children && fetchFolderContents && setFolderChildren) {
                setIsLoadingChildren(true)
                try {
                    const children = await fetchFolderContents(item.path)
                    setFolderChildren(item.path, children)
                } catch (err) {
                    console.error('Failed to load folder contents:', err)
                } finally {
                    setIsLoadingChildren(false)
                }
            }
        } else {
            setActiveFile(item)
        }
    }

    // Determine visibility based on search
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const shouldRender = !searchTerm || matchesSearch || hasSearchMatch

    if (!shouldRender) return null

    return (
        <div className="flex flex-col relative">
            <div
                onClick={handleClick}
                style={{ paddingLeft: `${depth * 20 + 12}px` }}
                className={`group flex items-center gap-2 py-1.5 cursor-pointer transition-colors hover:bg-(--secondary-button-hover) rounded-md mr-2 whitespace-nowrap min-w-max relative
                    ${isSelected ? 'bg-(--secondary-button) text-(--active-text-color)' : 'text-(--secondary-text-color)'}
                `}
            >
                {/* Vertical line guide for nested structures */}
                {depth > 0 && (
                    <div
                        className="absolute left-0 top-0 bottom-0 border-l border-(--main-border-color) opacity-20"
                        style={{ left: `${(depth - 1) * 20 + 20}px` }}
                    />
                )}

                <div className="flex items-center justify-center w-4 h-4">
                    {isFolder && (
                        <ChevronRight
                            size={14}
                            className={`transition-transform duration-200 ${(isOpen || (searchTerm && hasSearchMatch)) ? 'rotate-90' : ''}`}
                        />
                    )}
                </div>

                <span className="flex items-center gap-2">
                    {isFolder ? (
                        (isOpen || (searchTerm && hasSearchMatch)) ? <FolderOpen size={16} /> : <Folder size={16} />
                    ) : (
                        <FileText size={16} className="opacity-60" />
                    )}
                    <span className={`paragraph2 truncate ${matchesSearch && searchTerm ? 'text-(--primary-text-color) font-bold' : ''}`}>
                        {item.name}
                    </span>
                </span>
            </div>

            {isFolder && (isOpen || (searchTerm && hasSearchMatch)) && (
                <div className="flex flex-col">
                    {isLoadingChildren ? (
                        <div style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }} className="py-1.5 text-(--secondary-text-color) opacity-50 text-sm whitespace-nowrap">
                            Loading...
                        </div>
                    ) : item.children && item.children.length > 0 ? (
                        [...item.children]
                            .sort((a, b) => (b.type === 'dir') - (a.type === 'dir') || a.name.localeCompare(b.name))
                            .map((child, index) => (
                                <FileItem key={child.path || index} item={child} depth={depth + 1} searchTerm={searchTerm} />
                            ))
                    ) : item.children && item.children.length === 0 ? (
                        <div style={{ paddingLeft: `${(depth + 1) * 20 + 12}px` }} className="py-1.5 text-(--secondary-text-color) opacity-50 text-sm italic whitespace-nowrap">
                            Empty folder
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default function FileTree() {
    const [searchTerm, setSearchTerm] = useState("")
    const context = useContext(WorkspaceContext)

    if (!context || !context.contents) return null
    const { contents } = context

    return (
        <div className="file-tree flex flex-col h-full select-none min-h-0">
            {/* Search Input Section */}
            <div className="relative mb-6 group shrink-0">
                <Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-(--secondary-text-color) opacity-50 group-focus-within:opacity-100 transition-opacity"
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search files..."
                    className="w-full bg-(--card-bg-lighter) border border-(--main-border-color) rounded-xl py-2 pl-10 pr-10 paragraph2 outline-none focus:border-(--primary-button) transition-all text-(--primary-text-color)"
                />
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-(--secondary-button-hover) rounded-md transition-colors"
                    >
                        <X size={12} className="text-(--secondary-text-color)" />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 mb-4 shrink-0 px-1">
                <span className="paragraph-mini font-bold tracking-widest text-(--secondary-text-color) opacity-50">
                    {searchTerm ? `Results for "${searchTerm}"` : 'Files'}
                </span>
            </div>

            <div className="overflow-x-auto overflow-y-auto flex-1 scroll-bar min-w-0">
                <div className="min-w-max pb-4">
                    {contents.length > 0 ? (
                        [...contents]
                            .sort((a, b) => (b.type === 'dir') - (a.type === 'dir') || a.name.localeCompare(b.name))
                            .map((item, index) => (
                                <FileItem key={index} item={item} searchTerm={searchTerm} />
                            ))
                    ) : (
                        <div className="px-3 py-4 text-center">
                            <span className="paragraph2 text-(--secondary-text-color) opacity-50 italic">
                                No files found
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}