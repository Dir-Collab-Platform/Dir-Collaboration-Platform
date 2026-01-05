import { useMemo, useState, useEffect } from 'react'
import { cleanHTMLData } from '../utils/security'

/**
 * Custom hook to highlight code using PrismJS.
 * It handles its own Prism dependency by checking and loading scripts dynamically.
 * Note: cleanHTMLData is implemented locally to ensure the file is self-contained and resolves build errors.
 */
export function useSyntaxHighlighting(code, language = 'none') {
  const [isPrismReady, setIsPrismReady] = useState(!!window.Prism)

  useEffect(() => {
    if (window.Prism) return

    // 1. Load CSS
    if (!document.getElementById('prism-theme')) {
      const link = document.createElement('link')
      link.id = 'prism-theme'
      link.rel = 'stylesheet'
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css'
      document.head.appendChild(link)
    }

    // 2. Load JS
    if (!document.getElementById('prism-core')) {
      const script = document.createElement('script')
      script.id = 'prism-core'
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js'
      script.async = true

      script.onload = () => {
        setIsPrismReady(true)
        // Load Prism Line Numbers plugin JS
        const lineNumScript = document.createElement("script");
        lineNumScript.src = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js";
        document.body.appendChild(lineNumScript);
      }

      document.body.appendChild(script)


      // Load Prism Line Numbers plugin CSS
      const lineNumCSS = document.createElement("link");
      lineNumCSS.rel = "stylesheet";
      lineNumCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css";
      document.head.appendChild(lineNumCSS);
    } else {
      // If script exists but onload hasn't fired yet for this hook instance
      const checkInterval = setInterval(() => {
        if (window.Prism) {
          setIsPrismReady(true)
          clearInterval(checkInterval)
        }
      }, 100)
      return () => clearInterval(checkInterval)
    }
  }, [])

  return useMemo(() => {
    if (!code) return ""
    
    const Prism = window.Prism

    // Helper to escape HTML characters for plain text fallback
    const escapeHTML = (str) => {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
    }

    if (!Prism || !isPrismReady) {
      return cleanHTMLData(escapeHTML(code))
    }

    const normalizedLang = language.toLowerCase()
    
    // Check if the specific language grammar is loaded
    if (!Prism.languages[normalizedLang]) {
      return cleanHTMLData(escapeHTML(code))
    }

    try {
      // Highlight and then sanitize the resulting HTML string
      const highlighted = Prism.highlight(code, Prism.languages[normalizedLang], normalizedLang)
      return cleanHTMLData(highlighted)
    } catch (error) {
      console.error("Highlighting error:", error)
      return cleanHTMLData(escapeHTML(code))
    }
  }, [code, language, isPrismReady])
}