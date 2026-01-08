import { useMemo } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Import necessary languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup' // html
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'

import { cleanHTMLData } from '../utils/security'

/**
 * Custom hook to highlight code using PrismJS.
 * Uses local PrismJS package instead of CDN injection for inspection/reliability.
 */
export function useSyntaxHighlighting(code, language = 'none') {

  return useMemo(() => {
    if (!code) return ""

    // Helper to escape HTML characters for plain text fallback
    const escapeHTML = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    }

    // Map extensions to Prism language keys if needed
    // Common aliases: 'js' -> 'javascript', 'py' -> 'python', 'md' -> 'markdown'
    // Prism components usually register these aliases, but a map ensures it.
    const langMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'css': 'css',
      'activeFile': 'javascript', // Fallback? 
      'html': 'markup',
      'md': 'markdown',
      'json': 'json',
      'c': 'c',
      'cpp': 'cpp',
      'txt': 'text'
    }

    const normalizedLang = language.toLowerCase()
    const prismLangKey = langMap[normalizedLang] || normalizedLang

    // Check if the specific language grammar is loaded
    if (!Prism.languages[prismLangKey]) {
      console.warn(`Prism language '${prismLangKey}' not found, falling back to plain text.`)
      return cleanHTMLData(escapeHTML(code))
    }

    try {
      // Highlight and then sanitize the resulting HTML string
      const highlighted = Prism.highlight(code, Prism.languages[prismLangKey], prismLangKey)
      return cleanHTMLData(highlighted)
    } catch (error) {
      console.error("Highlighting error:", error)
      return cleanHTMLData(escapeHTML(code))
    }
  }, [code, language])
}