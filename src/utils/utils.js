export default function getRelativeTime (dateString) {
    if (!dateString) return null
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s`
    
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays}d`
    
    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) return `${diffInMonths}mo`
    
    const diffInYears = Math.floor(diffInMonths / 12)
    return `${diffInYears}y`
}

export function decodeFileContent(content, encoding) {
    if (!content) return ""

    try {
        let decoded = content

        if (encoding === 'base64') {
            // Remove any whitespace or newlines often found in base64 strings
            const cleanBase64 = content.replace(/\s/g, '')
            
            decoded = atob(cleanBase64)
        } else {
            // Your edit: proactively identifying unsupported types
            throw new Error(`Encodings other than 'base64' (received: '${encoding}') are not supported yet`)
        }

        // Standardize line endings and handle potential escaped characters
        // useful if the string was doubly-encoded or stringified in JSON
        return decoded
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\r/g, '')
            
    } catch (error) {
        console.error("Decoding error:", error)
        // Fallback: return the original content if decoding fails to keep the UI stable
        return content
    }
}
