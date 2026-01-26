import { useContext } from 'react'
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'

/**
 * LanguageStatsBar Component
 * Displays language statistics with hover tooltips showing percentage
 * Uses API data from context: Array<{ label, value (percentage), color }>
 */
export default function LanguageStatsBar() {
    const context = useContext(WorkspaceContext)

    if (!context) return null

    const { languages } = context;

    if (!languages || languages.length === 0) return null;

    // Sort by value descending (although backend usually provides sorted data, safe to ensure)
    const sortedLangs = [...languages].sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-2">
                <span className="paragraph-mini font-bold tracking-widest opacity-50 text-(--secondary-text-color)">
                    Languages
                </span>
            </div>

            {/* Language Bar */}
            <div className="relative h-3 w-full rounded-full overflow-hidden flex bg-(--secondary-button)">
                {sortedLangs.map((lang) => (
                    <div
                        key={lang.label}
                        className="h-full transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{
                            width: `${lang.value}%`,
                            backgroundColor: lang.color || '#6b7280'
                        }}
                        title={`${lang.label}: ${lang.value}%`}
                    />
                ))}
            </div>

            {/* Language Stats List */}
            <div className="stats grid grid-cols-1 gap-2">
                {sortedLangs.map((lang) => (
                    <div key={lang.label} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                            <span
                                className="rounded-full size-2.5"
                                style={{ backgroundColor: lang.color || '#6b7280' }}
                            />
                            <p className="paragraph2 font-bold text-(--primary-text-color)">{lang.label}</p>
                        </div>
                        <p
                            className="paragraph2 opacity-70 group-hover:opacity-100 transition-opacity text-(--secondary-text-color)"
                        >
                            {lang.value}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
