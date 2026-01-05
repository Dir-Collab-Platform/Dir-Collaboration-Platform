import { useContext, useMemo } from 'react'
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import { decodeFileContent } from "../../../../utils/utils"
import { useSyntaxHighlighting } from "../../../../hooks/useSyntaxHighlighting"

/**
 * CodeViewer Component
 * Logic:
 * 1. Decodes file content
 * 2. Uses the useSyntaxHighlighting hook for Prism logic
 * 3. Renders with a custom CSS-based line number system for perfect alignment
 */
export default function CodeViewer() {
    const context = useContext(WorkspaceContext)

    if (!context) return null
    
    const { activeFile } = context

    const extToLang = {
        'py': 'Python',
        'js': 'JavaScript',
        'jsx': 'React',
        'ts': 'TypeScript',
        'tsx': 'TypeScript',
        'cpp': 'C++',
        'css': 'CSS',
        'html': 'HTML',
        'md': 'Markdown',
        'json': 'JSON'
    }

    // 1. Decode content
    const rawContent = useMemo(() => {
        if (!activeFile?.content) return ""
        return decodeFileContent(activeFile.content, activeFile.encoding)
    }, [activeFile])

    const extension = activeFile?.name?.split('.').pop()?.toLowerCase() || 'none'

    // 2. Use the hook (hook should handle Prism.highlightElement internally)
    const highlightedHtml = useSyntaxHighlighting(rawContent, extension)

    // 3. Generate line numbers manually to ensure perfect 1:1 row alignment
    const lineNumbers = useMemo(() => {
        const lines = rawContent.split('\n')
        return lines.map((_, i) => i + 1)
    }, [rawContent])

    if (!activeFile) {
        return (
            <div className="flex items-center justify-center bg-(--dark-bg) h-64 rounded-2xl border border-(--main-border-color) text-(--secondary-text-color) italic">
                Select a file to preview
            </div>
        )
    }

    return (
        <div className="code-viewer-container flex flex-col w-full bg-(--code-viewer-container) border border-(--main-border-color) rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="code-upper flex items-center justify-between px-6 py-3 bg-(--code-upper-bg) border-b border-(--main-border-color)">
                <span className="text-[10px] font-semibold text-(--active-text-color) tracking-widest truncate max-w-[70%]">
                    {activeFile.name}
                </span>
                <div className="text-[10px] text-(--secondary-text-color) capitalize opacity-60 font-mono">
                    {extToLang[extension] || extension}
                </div>
            </div>

            {/* Code Body with Synchronized Gutter */}
            <div className="grow overflow-auto custom-scrollbar relative flex bg-transparent">
                {/* Manual Gutter: This ensures line numbers always match line height exactly */}
                <div className="gutter shrink-0 py-6 bg-transparent border-r border-(--main-border-color) select-none text-right" style={{ width: '3.5rem' }}>
                    {lineNumbers.map(num => (
                        <div key={num} className="text-[13px] leading-relaxed px-3 text-(--secondary-text-color) opacity-30 font-mono">
                            {num}
                        </div>
                    ))}
                </div>

                {/* Code Content */}
                <pre className="!m-0 !p-6 !bg-transparent !text-[13px] grow overflow-visible">
                    <code 
                        className={`language-${extension} leading-relaxed block whitespace-pre`}
                        dangerouslySetInnerHTML={{ __html: highlightedHtml }} 
                    />
                </pre>
            </div>

            {/* Footer */}
            <div className="px-6 py-2 bg-(--code-upper-bg) border-t border-(--main-border-color) flex justify-between items-center">
                <div className="text-[10px] text-(--secondary-text-color) font-mono opacity-60">
                    {rawContent.split('\n').length} lines • {activeFile.size || 0} bytes
                </div>
                <div className="text-[10px] text-(--secondary-text-color) opacity-60 font-mono uppercase">
                    UTF-8
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                pre, code {
                    tab-size: 4 !important;
                    -moz-tab-size: 4 !important;
                }
                pre[class*="language-"] {
                    text-shadow: none !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                }
                /* Ensure both gutter and code have the exact same line height */
                .leading-relaxed {
                    line-height: 1.625 !important;
                }
                .token.comment { color: #8b949e !important; font-style: italic; }
                .token.string { color: #a5d6ff !important; }
                .token.keyword { color: #ff7b72 !important; font-weight: 600; }
                .token.function { color: #d2a8ff !important; }
                .token.number { color: #79c0ff !important; }
            `}} />
        </div>
    )
}