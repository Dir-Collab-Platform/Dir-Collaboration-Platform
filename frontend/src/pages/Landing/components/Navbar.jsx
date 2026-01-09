import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GithubIcon } from '../../../../public/assets/icons/icons';
import Logo from '../../../common-components/Logo';


const Navbar = () => {
    const navigate = useNavigate();

    const BASE_URL = 'http://localhost:5000';

    const handleGithubLogin = () => {
        window.location.href = `${BASE_URL}/auth/github`;
    };

    return (
        <nav className="w-full py-4">
            <div className="flex items-center justify-between px-10 max-w-[1280px] mx-auto">
                {/* Logo */}
                <Logo />
                {/* Center Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#product" className="text-[var(--secondary-text-color)] mx-4 text-sm font-medium hover:text-[var(--primary-text-color)] transition-colors no-underline">Product</a>
                    <a href="#features" className="text-[var(--secondary-text-color)] mx-4 text-sm font-medium hover:text-[var(--primary-text-color)] transition-colors no-underline">Features</a>
                    <a href="#pricing" className="text-[var(--secondary-text-color)] mx-4 text-sm font-medium hover:text-[var(--primary-text-color)] transition-colors no-underline">Pricing</a>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    {/* <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium no-underline">
                        Login
                    </Link> */}
                    <button
                        onClick={handleGithubLogin}
                        className="bg-[var(--active-text-color)] text-white px-6 py-3 rounded-lg font-medium transition-opacity hover:opacity-90 border-none cursor-pointer text-sm no-underline"
                    >
                        Continue With GitHub
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;