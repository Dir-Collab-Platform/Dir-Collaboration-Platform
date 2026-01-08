import { useContext, useMemo } from 'react'
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import { useSyntaxHighlighting } from "../../../../hooks/useSyntaxHighlighting"

/**
 * CodeViewer Component
 * Logic:
 * 1. Uses file content directly (backend returns plain text, not encoded)
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

    // Backend returns plain text content, no decoding needed
    const rawContent = useMemo(() => {
        if (!activeFile?.content) return ""
        // Content is already plain text from backend
        return activeFile.content
    }, [activeFile])

    const extension = activeFile?.name?.split('.').pop()?.toLowerCase() || 'none'

    // Use the hook (hook should handle Prism.highlightElement internally)
    const highlightedHtml = useSyntaxHighlighting(rawContent, extension)

    // Generate line numbers manually to ensure perfect 1:1 row alignment
    const lineNumbers = useMemo(() => {
        const lines = rawContent.split('\n')
        return lines.map((_, i) => i + 1)
    }, [rawContent])

    if (!activeFile) {
        return (
            <div className="flex items-center justify-center h-64 rounded-2xl border italic" style={{
                backgroundColor: 'var(--dark-bg)',
                borderColor: 'var(--main-border-color)',
                color: 'var(--secondary-text-color)'
            }}>
                Select a file to preview
            </div>
        )
    }

    return (
        <div className="code-viewer-container flex flex-col w-full border rounded-2xl overflow-hidden shadow-2xl" style={{
            backgroundColor: 'var(--code-viewer-container)',
            borderColor: 'var(--main-border-color)'
        }}>
            {/* Header */}
            <div className="code-upper flex items-center justify-between px-6 py-3 border-b" style={{
                backgroundColor: 'var(--code-upper-bg)',
                borderColor: 'var(--main-border-color)'
            }}>
                <span className="text-[10px] font-semibold tracking-widest truncate max-w-[70%]" style={{ color: 'var(--active-text-color)' }}>
                    {activeFile.name}
                </span>
                <div className="text-[10px] capitalize opacity-60 font-mono" style={{ color: 'var(--secondary-text-color)' }}>
                    {extToLang[extension] || extension}
                </div>
            </div>

            {/* Code Body with Synchronized Gutter */}
            <div className="grow overflow-auto custom-scrollbar relative flex bg-transparent">
                {/* Manual Gutter: This ensures line numbers always match line height exactly */}
                <div className="gutter shrink-0 py-6 bg-transparent border-r select-none text-right" style={{ 
                    width: '3.5rem',
                    borderColor: 'var(--main-border-color)'
                }}>
                    {lineNumbers.map(num => (
                        <div key={num} className="text-[13px] leading-relaxed px-3 font-mono opacity-30" style={{ color: 'var(--secondary-text-color)' }}>
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
            <div className="px-6 py-2 border-t flex justify-between items-center" style={{
                backgroundColor: 'var(--code-upper-bg)',
                borderColor: 'var(--main-border-color)'
            }}>
                <div className="text-[10px] font-mono opacity-60" style={{ color: 'var(--secondary-text-color)' }}>
                    {rawContent.split('\n').length} lines • {activeFile.size || 0} bytes
                </div>
                <div className="text-[10px] opacity-60 font-mono uppercase" style={{ color: 'var(--secondary-text-color)' }}>
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
