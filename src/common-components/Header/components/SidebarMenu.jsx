import React from "react"
import { Link } from "react-router-dom"
import {
    LayoutDashboard,
    Folder,
    Settings,
    Search,
    LogOut,
    X,
    Workflow
} from "lucide-react"

export default function SidebarMenu({ isMenuOpen, onClose }) {
    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to log out?")
        if (confirmLogout) {
            // Handle logout logic here
        }
        onClose()
    }

    return (
        <div 
            className={`fixed top-0 right-0 w-80 h-screen z-50 transition-transform duration-300 overflow-y-auto bg-(--dark-bg) border-l border-(--popup-border) ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            <button
                onClick={onClose}
                className="absolute top-4 left-4 p-2 rounded-md text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors"
            >
                <X size={20} />
            </button>

            <div className="flex items-center gap-4 mt-16 mb-8 px-4 py-3 rounded-lg mx-4 bg-(--card-bg)">
                <img 
                    src="/assets/images/person.jpg" 
                    alt="person" 
                    className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                    <p className="font-semibold text-(--primary-text-color)">Efrata</p>
                    <p className="text-sm text-(--secondary-text-color)">@zeamanuel</p>
                </div>
            </div>

            <hr className="my-4 mx-4 border-(--main-border-color)" />

            <div className="px-4 space-y-1">
                <Link 
                    to="/"
                    onClick={onClose}
                    className="group flex items-center gap-3 w-full p-3 rounded-lg text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors"
                >
                    <LayoutDashboard size={20} className="text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors" />
                    <span>Dashboard</span>
                </Link>

                <Link 
                    to="/repositories"
                    onClick={onClose}
                    className="group flex items-center gap-3 w-full p-3 rounded-lg text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors"
                >
                    <Folder size={20} className="text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors" />
                    <span>Repositories</span>
                </Link>

                <Link 
                    to="/workspaces"
                    onClick={onClose}
                    className="group flex items-center gap-3 w-full p-3 rounded-lg text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors"
                >
                    <Workflow size={20} className="text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors" />
                    <span>Workspaces</span>
                </Link>

                <Link 
                    to="/profile"
                    onClick={onClose}
                    className="group flex items-center gap-3 w-full p-3 rounded-lg text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors"
                >
                    <Settings size={20} className="text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors" />
                    <span>Settings</span>
                </Link>

                <Link 
                    to="/explore"
                    onClick={onClose}
                    className="group flex items-center gap-3 w-full p-3 rounded-lg text-(--secondary-text-color) hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color) transition-colors"
                >
                    <Search size={20} className="text-(--secondary-text-color) group-hover:text-(--primary-text-color) transition-colors" />
                    <span>Explore</span>
                </Link>
            </div>

            <hr className="my-4 mx-4 border-(--main-border-color)" />

            <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors mx-4 text-[#ff4757] hover:bg-[#ff47571a]"
            >
                <LogOut size={20} className="text-[#ff4757]" />
                <span>Log out</span>
            </button>
        </div>
    )
}