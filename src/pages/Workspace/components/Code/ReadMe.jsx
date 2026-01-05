import { useContext, useMemo } from 'react'
import { Pencil } from "lucide-react"
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'
import { decodeFileContent } from '../../../../utils/utils'
import { marked } from 'marked'
import { cleanHTMLData } from '../../../../utils/security'

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
 * 1. Shows README.md file content if it exists
 * 2. Falls back to repository description
 * 3. Applies syntax highlighting via the custom hook
 */
export default function ReadMe() {
    const context = useContext(WorkspaceContext)
    
    if (!context) return null
    
    const { repository, contents } = context

    // 1. Locate the README file
    const readmeFile = useMemo(() => {
        return contents?.find(f => f.name.toLowerCase() === 'readme.md')
    }, [contents])

    // 2. Extract raw content
    const rawContent = useMemo(() => {
        if (readmeFile) {
            return decodeFileContent(readmeFile.content, readmeFile.encoding)
        }
        return repository?.description || null
    }, [readmeFile, repository])

    // 3. Apply Syntax Highlighting (using 'markdown' as the language)
    const formattedReadme = cleanHTMLData(marked(rawContent))

    if (!rawContent) return null

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
            <div className="readme-content flex flex-col gap-6 px-8 py-8 overflow-x-auto">
                <div className="border-b border-(--main-border-color) pb-4">
                    <h2 className="header2 font-bold text-(--primary-text-color)">
                        {repository?.name || "Repository Preview"}
                    </h2>
                </div>
                
                {/* Using dangerouslySetInnerHTML to render the highlighted markdown code. */}
                <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                    <pre className="!bg-transparent !p-0 !m-0 !overflow-visible">
                        <code 
                            className="text-(--secondary-text-color) leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: formattedReadme }}
                        />
                    </pre>
                </div>
            </div>
        </div>
    )
}