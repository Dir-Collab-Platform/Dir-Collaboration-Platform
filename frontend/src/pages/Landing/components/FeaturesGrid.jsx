import React from 'react';
import { GithubIcon } from '../../../../public/assets/icons/icons';

const FeaturesGrid = () => {
    return (
        <section id="features" className="py-20 max-w-[1200px] mx-auto px-5">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">

                {/* Feature 1: Integrated Messaging (Span 2) */}
                <div className="md:col-span-2 bg-[var(--card-bg)] rounded-xl border border-[var(--main-border-color)] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group bg-[var(--dimmer-dark-bg)]">
                    <div className="flex-1 z-10">
                        <div className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-semibold mb-4">
                            Collaboration
                        </div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-3 text-white">Real-Time Collaboration</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)]">Context-aware messaging scoped to specific channels and workspaces. Mention code snippets and resolve issues instantly.</p>

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
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-2 text-white">Deep Analytics</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)]">View repository statistics, star counts, and contribution heatmaps. Monitor global and repository-specific activity logs.</p>
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
                        <div className="text-2xl font-bold text-indigo-500 mb-2">Instant</div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-2 text-white">File Navigation</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)] mb-4">Cache-first file tree exploration for instant access to code. Optimized loading architecture ensures zero lag.</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pb-2 border-b border-gray-800">
                        <span className="text-xs text-gray-500">Powered by DIR Sync Engine</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                </div>

                {/* Feature 4: Enterprise Grade Security (Span 2) */}
                <div className="md:col-span-2 bg-[var(--card-bg)] rounded-xl border border-[var(--main-border-color)] p-8 flex items-center gap-8">
                    <div className="w-24 h-24 shrink-0 rounded-full border-4 border-dashed border-gray-700 flex items-center justify-center">
                        <GithubIcon className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                        <h3 className="text-[var(--header2-size)] font-semibold mb-2 text-white">GitHub Integration</h3>
                        <p className="text-[var(--paragraph2-size)] text-[var(--secondary-text-color)]">Track live build statuses and workflow runs directly in the dashboard. Manual and automatic synchronization with GitHub metadata.</p>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default FeaturesGrid;