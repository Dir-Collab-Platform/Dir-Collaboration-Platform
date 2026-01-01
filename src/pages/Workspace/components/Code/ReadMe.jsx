import { useContext, useMemo } from 'react'
import { Pencil } from "lucide-react"
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import { decodeFileContent } from '../../../../utils/utils'

/**
 * Edit button for the Readme
 */
function EditBtn() {
    return (
        <button className="svg-btn icon-btn hover:text-(--active-text-color) transition-colors cursor-pointer">
            <Pencil size={18} />
        </button>
    )
}

/**
 * ReadMe Component
 * Logic: 
 * 1. Shows README.md file content if it exists (decoded using utility)
 * 2. Falls back to repository description if no file exists
 * 3. Returns null if neither are available
 */
export default function ReadMe() {
    const context = useContext(WorkspaceContext)
    
    if (!context) return null
    
    const { repository, contents } = context

    // 1. Locate the README file in the contents array
    const readmeFile = useMemo(() => {
        return contents?.find(f => f.name.toLowerCase() === 'readme.md')
    }, [contents])

    // 2. Extract and decode the display content
    const displayContent = useMemo(() => {
        // Priority 1: The actual README.md file content
        if (readmeFile) {
            return decodeFileContent(readmeFile.content, readmeFile.encoding)
        }

        // Priority 2: Repository description
        if (repository?.description) {
            return repository.description
        }

        // Priority 3: Nothing
        return null
    }, [readmeFile, repository])

    // If there is absolutely nothing to show, return null
    if (!displayContent) return null

    return (
        <div className="bg-(--card-bg) border border-(--main-border-color) rounded-2xl overflow-hidden shadow-sm">
            {/* Header Section */}
            <div className="header flex justify-between items-center px-6 py-3 bg-(--code-upper-bg) border-b border-(--main-border-color)">
                <div className="flex items-center gap-2">
                    <h1 className="paragraph1 font-semibold text-(--primary-text-color)">
                        {readmeFile ? 'README.md' : 'Description'}
                    </h1>
                </div>
                <EditBtn />
            </div>

            {/* Content Section */}
            <div className="readme-content flex flex-col gap-6 px-8 py-8">
                <div className="border-b border-(--main-border-color) pb-4">
                    <h2 className="header2 font-bold text-(--primary-text-color)">
                        {repository?.name || "Repository Preview"}
                    </h2>
                </div>
                
                <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                    <p className="paragraph1 text-(--secondary-text-color) leading-relaxed">
                        {displayContent}
                    </p>
                </div>
            </div>
        </div>
    )
}