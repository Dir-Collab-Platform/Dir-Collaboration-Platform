import React, { useMemo } from 'react';
import './Particles.css';

const Particles = () => {
    // Generate random particles
    const particles = useMemo(() => {
        return [...Array(20)].map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2 + 'px', // 2-6px
            left: Math.random() * 100 + '%',
            duration: Math.random() * 10 + 10 + 's', // 10-20s
            delay: Math.random() * 5 + 's',
            color: [
                'bg-blue-500',
                'bg-purple-500',
                'bg-indigo-400',
                'bg-pink-400',
                'bg-white'
            ][Math.floor(Math.random() * 5)]
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={`particle ${p.color}`}
                    style={{
                        width: p.size,
                        height: p.size,
                        left: p.left,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                        bottom: '-10px' // Start slightly below
                    }}
                ></div>
            ))}
        </div>
    );
};

export default Particles;