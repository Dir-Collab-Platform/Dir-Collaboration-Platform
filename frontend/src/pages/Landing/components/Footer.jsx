import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-[rgba(255,255,255,0.05)] py-12 mt-20">
            <div className="max-w-[1200px] mx-auto px-5 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--secondary-text-color)]">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <div className="w-5 h-5 bg-indigo-900/50 rounded flex items-center justify-center text-white text-[10px] font-bold">
                        D
                    </div>
                    <span className="opacity-60">© 2024 DIR Platform.</span>
                </div>

                <div className="flex items-center gap-8">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs opacity-60">System Operational</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;