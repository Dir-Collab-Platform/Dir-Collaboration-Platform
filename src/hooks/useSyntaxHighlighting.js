import { useMemo } from "react"

export function useSyntaxHighlighting(code, language = 'none') {
    return useMemo(() => {
        if (!code) return ""
        
        // Ensure Prism is available on the window object
        const Prism = window.Prism

        if (!Prism) {
            console.warn("PrismJS not found on window object")
            return code
        }

        // Use the language/extension directly as Prism handles most common aliases
        const normalizedLang = language.toLowerCase()

        // Check if the grammar for the language is loaded
        if (Prism.languages[normalizedLang]) {
            try {
                return Prism.highlight(code, Prism.languages[normalizedLang], normalizedLang)
            } catch (error) {
                console.error("Highlighting error:", error)
                return code
            }
        }

        // Fallback to basic HTML escaping if language grammar isn't loaded
        return code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            
    }, [code, language])
}