import { useContext } from 'react'
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'
/**
 * Standard colors for common languages
 */
const LANGUAGE_COLORS = {
    JavaScript: "bg-yellow-300",
    CSS: "bg-indigo-600",
    HTML: "bg-orange-500",
    Python: "bg-blue-500",
    TypeScript: "bg-blue-600",
    default: "bg-gray-400"
}

function LangBar({ languages, total }) {
    // Sort languages by size to stack them correctly
    const sortedLangs = Object.entries(languages).sort((a, b) => b[1] - a[1])
    
    return (
        <div className="relative h-3 w-full bg-(--secondary-button) rounded-full overflow-hidden flex">
            {sortedLangs.map(([name, size]) => {
                const percentage = (size / total) * 100
                const bgColor = LANGUAGE_COLORS[name] || LANGUAGE_COLORS.default
                
                return (
                    <div 
                        key={name}
                        style={{ width: `${percentage}%` }}
                        className={`h-full ${bgColor} transition-all duration-500`}
                        title={`${name}: ${percentage.toFixed(1)}%`}
                    />
                )
            })}
        </div>
    )
}

export default function LanguageStatsBar() {
    const context = useContext(WorkspaceContext)

    if (!context || !context.languages) return null
    const { languages } = context

    const totalBytes = Object.values(languages).reduce((acc, curr) => acc + curr, 0)

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-2">
                <span className="paragraph-mini font-bold tracking-widest text-(--secondary-text-color) opacity-50">
                    Languages
                </span>
            </div>

            <LangBar languages={languages} total={totalBytes} />

            <div className="stats grid grid-cols-1 gap-2">
                {Object.entries(languages)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, size]) => {
                        const percentage = ((size / totalBytes) * 100).toFixed(1)
                        const bgColor = LANGUAGE_COLORS[name] || LANGUAGE_COLORS.default
                        
                        return (
                            <div key={name} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2">
                                    <span className={`rounded-full size-2.5 ${bgColor}`}></span>
                                    <p className="paragraph2 font-bold text-(--primary-text-color)">{name}</p>
                                </div>
                                <p className="paragraph2 text-(--secondary-text-color) opacity-70 group-hover:opacity-100 transition-opacity">
                                    {percentage}%
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}