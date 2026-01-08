import React from 'react';

export default function Logo() {
    return (
        <div className="flex items-center gap-2 select-none">
            <span className="text-2xl leading-none">🕸️</span>
            <h1 className="text-2xl font-bold leading-none" style={{ color: 'var(--primary-text-color)' }}>Dir</h1>
        </div>
    );
}
