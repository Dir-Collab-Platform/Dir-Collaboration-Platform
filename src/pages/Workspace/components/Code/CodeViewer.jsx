import { useContext, useMemo, useEffect, useRef } from 'react'
import { WorkspaceContext } from "../../../../context/WorkspaceContext/WorkspaceContext"
import { decodeFileContent } from '../../../../utils/utils';

const PRISM_CDN = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js";
const PRISM_THEME = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
const PRISM_AUTO_LOADER = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js";

export default function CodeViewer() {
    const context = useContext(WorkspaceContext);
    const codeRef = useRef(null);
    const { activeFile } = context || {};

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
    };

    // 1. Load Prism Library
    useEffect(() => {
        if (!document.getElementById('prism-theme')) {
            const link = document.createElement('link');
            link.id = 'prism-theme';
            link.rel = 'stylesheet';
            link.href = PRISM_THEME;
            document.head.appendChild(link);
        }

        if (!window.Prism) {
            const script = document.createElement('script');
            script.src = PRISM_CDN;
            script.onload = () => {
                const loader = document.createElement('script');
                loader.src = PRISM_AUTO_LOADER;
                document.head.appendChild(loader);
            };
            document.head.appendChild(script);
        }
    }, []);

    // 2. Decode content
    const content = useMemo(() => {
        if (!activeFile?.content) return "";
        return decodeFileContent(activeFile.content, activeFile.encoding)
    }, [activeFile]);

    // 3. Trigger Highlighting
    useEffect(() => {
        if (window.Prism && codeRef.current) {
            window.Prism.highlightElement(codeRef.current);
        }
    }, [content, activeFile]);

    if (!activeFile) {
        return (
            <div className="flex items-center justify-center bg-(--dark-bg) h-64 rounded-2xl border border-(--main-border-color) text-(--secondary-text-color) italic">
                Select a file to preview
            </div>
        );
    }

    const encoding = activeFile.encoding || ''
    const extension = activeFile.name?.split('.').pop()?.toLowerCase() || 'none';
    const langClass = `language-${extension}`;

    return (
        <div className="code-viewer-container flex flex-col w-full bg-(--code-viewer-container) border border-(--main-border-color) rounded-2xl overflow-hidden shadow-2xl">
            {/* Header / Toolbar */}
            <div className="code-upper flex items-center justify-between px-6 py-3 bg-(--code-upper-bg) border-b border-(--main-border-color)">
                <span className="text-[10px] font-semibold capitalize text-(--active-text-color) tracking-widest">
                    {extToLang[extension] || extension}
                </span>
                <div className="text-[10px] text-(--secondary-text-color) opacity-60 font-mono">
                    {encoding}
                </div>
            </div>

            {/* Code Body */}
            <div className="grow overflow-auto custom-scrollbar relative">
                <pre className={`!m-0 !p-6 !bg-transparent !text-[13px] line-numbers ${langClass}`}>
                    <code ref={codeRef} className={langClass}>
                        {content}
                    </code>
                </pre>
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-2 bg-(--code-upper-bg) border-t border-(--main-border-color) flex justify-between items-center">
                <div className="text-[10px] text-(--secondary-text-color) font-mono opacity-60">
                    {content.split('\n').length} lines • {activeFile.size || 0} bytes
                </div>
                <div className="text-[10px] text-(--secondary-text-color) opacity-60 font-mono uppercase">
                    UTF-8
                </div>
            </div>

            {/* Prism Token Overrides (Using GitHub-Dark-inspired colors) */}
            <style dangerouslySetInnerHTML={{ __html: `
                pre[class*="language-"] {
                    text-shadow: none !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    background: transparent !important;
                }
                .token.comment, .token.prolog, .token.doctype, .token.cdata { 
                    color: #8b949e !important; 
                    font-style: italic; 
                }
                .token.string, .token.attr-value { color: #a5d6ff !important; }
                .token.keyword, .token.selector, .token.atrule { color: #ff7b72 !important; font-weight: 600; }
                .token.function, .token.attr-name { color: #d2a8ff !important; }
                .token.operator, .token.entity, .token.url { color: #ff7b72 !important; }
                .token.number, .token.boolean, .token.constant, .token.property { color: #79c0ff !important; }
                .token.punctuation { color: #7d8590 !important; }
                .token.tag { color: #7ee787 !important; }
            `}} />
        </div>
    );
}