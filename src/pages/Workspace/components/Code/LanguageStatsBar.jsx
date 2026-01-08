import { useContext } from 'react'
import { WorkspaceContext } from '../../../../context/WorkspaceContext/WorkspaceContext'
import { mockLanguages } from '../../../../data/mockData';
import { useParams } from 'react-router-dom';

/**
 * LanguageStatsBar Component
 * Displays language statistics with hover tooltips showing percentage
 * Uses API structure: { label, value (percentage), color }
 */
export default function LanguageStatsBar() {
    const context = useContext(WorkspaceContext)
    const { id } = useParams();

    if (!context) return null

    // Get languages from mock data (in real app, this would come from context or API)
    const languages = mockLanguages[id] || context.languages ? 
        Object.entries(context.languages || {}).map(([label, bytes]) => {
            // Convert bytes to percentage if needed
            const total = Object.values(context.languages || {}).reduce((a, b) => a + b, 0);
            const value = total > 0 ? (bytes / total) * 100 : 0;
            // Get color from languageColors or use default
            const colorMap = {
                'JavaScript': '#f1e05a',
                'TypeScript': '#3178c6',
                'Python': '#3572A5',
                'C++': '#f34b7d',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'CMake': '#064f8c',
                'Shell': '#89e051'
            };
            return {
                label,
                value: value.toFixed(1),
                color: colorMap[label] || '#6b7280'
            };
        }) : mockLanguages[id] || [];

    // If we have languages from mock data, use those (they're already in the right format)
    const displayLanguages = mockLanguages[id] || languages;

    if (!displayLanguages || displayLanguages.length === 0) return null;

    // Sort by value descending
    const sortedLangs = [...displayLanguages].sort((a, b) => b.value - a.value);
    
    return (
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-center gap-2">
                <span className="paragraph-mini font-bold tracking-widest opacity-50" style={{ color: 'var(--secondary-text-color)' }}>
                    Languages
                </span>
            </div>

            {/* Language Bar */}
            <div className="relative h-3 w-full rounded-full overflow-hidden flex" style={{ backgroundColor: 'var(--secondary-button)' }}>
                {sortedLangs.map((lang) => (
                    <div 
                        key={lang.label}
                        className="h-full transition-all duration-500 hover:opacity-80 cursor-pointer"
                        style={{ 
                            width: `${lang.value}%`,
                            backgroundColor: lang.color || '#6b7280'
                        }}
                        title={`${lang.label}: ${lang.value.toFixed(1)}%`}
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
                            <p className="paragraph2 font-bold" style={{ color: 'var(--primary-text-color)' }}>{lang.label}</p>
                        </div>
                        <p 
                            className="paragraph2 opacity-70 group-hover:opacity-100 transition-opacity"
                            style={{ color: 'var(--secondary-text-color)' }}
                        >
                            {typeof lang.value === 'number' ? lang.value.toFixed(1) : lang.value}%
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
