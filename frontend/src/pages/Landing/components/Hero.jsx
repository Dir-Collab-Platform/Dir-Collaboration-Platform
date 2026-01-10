import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { GithubIcon } from '../../../../public/assets/icons/icons';
import Particles from './Particles';

const Hero = () => {
    // const navigate = useNavigate();
    const BASE_URL = 'http://localhost:5000';


    const handleJoinBeta = () => {
        alert("Redirecting to Dashboard...");
        window.location.href = `${BASE_URL}/auth/github`;
    };

    return (
        <section className="relative pt-20 pb-16 text-center max-w-[1400px] mx-auto px-5">
            {/* Background Effects */}
            <Particles />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] -z-10"></div>

            <div className="relative z-10">

                <h1 className="text-[72px] font-bold leading-[1.1] text-[var(--primary-text-color)] tracking-tight mb-6">
                    The Future of <br />
                    <span className="bg-gradient-to-r from-[#4299E1] to-[#667EEA] bg-clip-text text-transparent">Collaborative Coding</span>
                </h1>

                <p className="text-[var(--paragraph1-size)] text-[var(--secondary-text-color)] leading-relaxed max-w-2xl mx-auto mb-10 text-lg">
                    The ultimate integrated repository for modern development teams. <br className="hidden md:block" />
                    Manage, code, and chat in one unified interface.
                </p>

                <div className="mb-20">
                    <button
                        onClick={handleJoinBeta}
                        className="bg-[var(--active-text-color)] text-white px-8 py-3 rounded-lg font-medium transition-opacity hover:opacity-90 border-none cursor-pointer text-base"
                    >
                        <GithubIcon className="inline-block mr-2" />
                        Continue With GitHub
                    </button>
                </div>

                {/* Visuals Container */}
                <div className="flex flex-col xl:flex-row gap-8 items-center justify-center">
                    {/* IDE Mockup */}
                    {/* <div className="relative w-full xl:w-1/2 max-w-2xl rounded-xl overflow-hidden shadow-2xl border border-[var(--main-border-color)] bg-[#0D1117]" style={{ boxShadow: '0 0 100px -20px rgba(66, 85, 194, 0.2)' }}>
                        
                    <div className="flex items-center px-4 py-3 bg-[#161B22] border-b border-[var(--main-border-color)]">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="mx-auto text-xs text-gray-500 font-mono">DIR - main.tsx</div>
                    </div>

                    <div className="flex text-left font-mono text-sm h-[320px]">
                        
                        <div className="w-12 border-r border-[var(--main-border-color)] flex flex-col items-center py-4 gap-6 text-gray-500">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        </div>

                        
                        <div className="flex-1 p-6 bg-[#0D1117] overflow-hidden">
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">1</div>
                                <div className="text-gray-300">
                                    <span className="text-[var(--code-keyword)]">import</span> <span className="text-yellow-300">{`{ repository } `}</span> <span className="text-[var(--code-keyword)]">from</span> <span className="text-[var(--code-string)]">'@dir/core'</span>;
                                </div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">2</div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">3</div>
                                <div className="text-gray-300">
                                    <span className="text-[var(--code-keyword)]">async function</span> <span className="text-[var(--code-function)]">syncProject</span> <span className="text-yellow-300">() {`{
    `}</span>
                                </div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">4</div>
                                <div className="text-gray-300 pl-4">
                                    <span className="text-[var(--code-keyword)]">await</span> <span className="text-white">repository</span>.<span className="text-[var(--code-function)]">collaborate</span>({`{
        `}
                                </div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">5</div>
                                <div className="text-gray-300 pl-8">
                                    <span className="text-indigo-300">mode:</span> <span className="text-[var(--code-string)]">'real-time'</span>,
                                </div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">6</div>
                                <div className="text-gray-400 pl-8 relative">
                                    <span className="text-indigo-300">platform:</span> <span className="text-[var(--code-string)]">'WEB'</span>
                                    <div className="absolute top-0 left-36 w-0.5 h-5 bg-blue-500 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">7</div>
                                <div className="text-gray-300 pl-4">
                                    {`}); `}
                                </div>
                            </div>
                            <div className="flex mb-1">
                                <div className="w-6 text-gray-600 select-none text-right pr-4">8</div>
                                <div className="text-gray-300">
                                    {`} `}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div> */}

                    {/* Dashboard Screenshot */}
                    <div className="relative w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-[var(--main-border-color)] bg-[#0D1117]" style={{ boxShadow: '0 0 100px -20px rgba(139, 92, 246, 0.2)' }}>
                        <img 
                            src="/assets/images/screenshot_1.5x_postspark_2026-01-10_08-33-16 copy.png" 
                            alt="Dir Dashboard Interface" 
                            className="w-full h-auto object-cover block"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;