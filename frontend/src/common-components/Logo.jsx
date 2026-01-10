import React from 'react';

export default function Logo({className = ''}) {
    return (
        <div className={`flex items-center gap-2 select-none ${className}`}>
            <span className="text-[36px] leading-none">🕸️</span>
            <h1 className="text-[36px] font-bold leading-none" style={{ color: 'var(--primary-text-color)' }}>Dir</h1>
        </div>
    );
}
