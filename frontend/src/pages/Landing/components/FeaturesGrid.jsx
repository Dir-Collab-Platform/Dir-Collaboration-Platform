import React from 'react';

const FeaturesGrid = () => {
    return (
        <section id="features" className="py-20 max-w-[1200px] mx-auto px-5">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">

                {/* Feature 1: Integrated Messaging (Span 2) */}
                <div className="md:col-span-2 bg-[var(--card-bg)] rounded-xl border border-[var(--main-border-color)] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group bg-[var(--dimmer-dark-bg)]">
                    <div className="flex-1 z-10">
                        <div className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold mb-4">
                            Workflow
                        </div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-3 text-white">Integrated Messaging</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)]">Chat with your team directly inside the file you're editing. Mention code snippets and resolve issues instantly.</p>

                        <div className="flex gap-2 mt-6">
                            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#1D1D29]"></div>
                            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#1D1D29] -ml-4"></div>
                        </div>
                    </div>

                    {/* Visual Mockup for Messaging */}
                    <div className="flex-1 w-full relative">
                        <div className="bg-[#0f1115] p-3 rounded-lg border border-[#2d2d3b] text-xs font-mono shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                            <div className="flex items-start gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-blue-500 shrink-0"></div>
                                <div className="bg-[#1F1F31] p-2 rounded-tr-lg rounded-br-lg rounded-bl-lg text-gray-300">
                                    Check out the sync in <span className="text-blue-400">lib/opt.rs</span>?
                                </div>
                            </div>
                            <div className="flex items-start gap-2 justify-end mb-3">
                                <div className="bg-[#213370] p-2 rounded-tl-lg rounded-bl-lg rounded-br-lg text-white">
                                    Looks good! I'll push the PR now 🚀
                                </div>
                                <div className="w-6 h-6 rounded-full bg-purple-500 shrink-0"></div>
                            </div>
                            <div className="text-[10px] text-gray-500 text-center mt-2">
                                GitBot: merging in 5...
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature 2: Version Control (Span 1) */}
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--main-border-color)] p-8 flex flex-col relative overflow-hidden group">
                    <div className="mb-auto z-10">
                        <div className="h-8 w-8 text-indigo-400 mb-4">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-2 text-white">Version Control</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)]">Visual branching and merge conflict resolution like you've never seen before.</p>
                    </div>

                    {/* Visual abstract */}
                    <div className="mt-8 flex items-center justify-center">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div className="w-8 h-0.5 bg-gray-700"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                            <div className="w-8 h-0.5 bg-gray-700"></div>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                    </div>
                </div>

                {/* Feature 3: Real-time Sync (Span 1) */}
                <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--main-border-color)] p-8 flex flex-col justify-between group">
                    <div>
                        <div className="text-2xl font-bold text-indigo-500 mb-2">27ms</div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-2 text-white">Real-time Sync</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)] mb-4">Multi-cursor editing with sub-millisecond latency for teams of any size.</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pb-2 border-b border-gray-800">
                        <span className="text-xs text-gray-500">Powered by DIR Sync Engine</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Feature 4: Enterprise Grade Security (Span 2) */}
                <div className="md:col-span-2 bg-[var(--card-bg)] rounded-xl border border-[var(--main-border-color)] p-8 flex items-center gap-8">
                    <div className="w-24 h-24 shrink-0 rounded-full border-4 border-dashed border-gray-700 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-2 text-white">Enterprise Grade Security</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)]">SOC2, end-to-end encryption, and role-based access control built into the foundation of the platform.</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesGrid;