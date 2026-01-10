import React from 'react';

const IntegrationBar = () => {
    return (
        <div className="py-12 border-b border-transparent">
            <p className="text-center text-[10px] uppercase tracking-widest text-[#52525b] mb-8 font-semibold">
                Integrates with your favorite tool
            </p>
            <div className="flex justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Simplified SVGs for logos */}
                <div className="flex items-center gap-2 text-[#C9D1D9]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    <span className="font-semibold text-lg">GitHub</span>
                </div>
                {/* <div className="flex items-center gap-2 text-[#FC6D26]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .41.26l2.47 7.6h8.6l2.47-7.6a.43.43 0 0 1 .41-.26.42.42 0 0 1 .11.02l2.44 7.51 1.22 3.78a.84.84 0 0 1-.3.94zM7.05 10.22L4.93 3.72 2.17 12.2l4.88 2.19zM11.95 21.47l5.29-9-5.29-2.25-5.29 2.25zM16.95 10.22l4.88 2.19-2.76-8.48z" /></svg>
                    <span className="font-semibold text-lg text-[#C9D1D9]">GitLab</span>
                </div>
                <div className="flex items-center gap-2 text-[#0052CC]">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.834 8.286a1.182 1.182 0 1 0 0 2.363 1.182 1.182 0 0 0 0-2.363zM15.75 3.208a.965.965 0 0 0-.256-.002L3.62 4.883a.966.966 0 0 0-.796.71c-.024.113-.024.22-.008.33l3.078 13.176a.966.966 0 0 0 .942.74h10.328a.966.966 0 0 0 .941-.74l3.079-13.177c.071-.43-.162-.857-.564-.997a.972.972 0 0 0-.332-.057h-.538V3.208zm3.649 14.887H6.938L4.694 6.945l16.95.002-2.245 11.149z" /></svg>
                    <span className="font-semibold text-lg text-[#C9D1D9]">Bitbucket</span>
                </div> */}
            </div>
        </div>
    );
};

export default IntegrationBar;