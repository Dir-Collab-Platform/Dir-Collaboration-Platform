import React from 'react';
import { GithubIcon } from '../../../../public/assets/icons/icons';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        alert("Redirecting to Dashboard...");
        navigate('/dashboard');
    };

    return (
        <section className="py-20 container-custom px-4 max-w-[1200px] mx-auto">
            <div className="relative rounded-2xl overflow-hidden p-16 text-center bg-gradient-to-b from-[#1D1D29] to-[#0f0f16] border border-[#2d2d3d]">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[300px] bg-blue-900/20 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-[var(--header1-size)] font-semibold mb-4 text-white text-3xl md:text-4xl">Ready to build the future?</h2>
                    <p className="text-[var(--paragraph1-size)] text-[var(--secondary-text-color)] leading-relaxed mb-10 text-lg">
                        Join thousands of developers and start shipping faster today.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleGetStarted}
                            className="bg-white text-black px-6 py-3 rounded-lg font-semibold cursor-pointer text-sm w-full sm:w-auto hover:opacity-90"
                        >
                            Get Started Now
                        </button>
                        <button className="bg-[var(--card-bg-lighter)] text-[var(--primary-text-color)] px-6 py-3 rounded-lg font-medium border border-[var(--main-border-color)] cursor-pointer text-sm w-full sm:w-auto hover:bg-[var(--card-bg-lighter2)]">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;