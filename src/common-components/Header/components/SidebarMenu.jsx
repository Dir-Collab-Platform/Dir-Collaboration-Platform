import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import {
    LayoutDashboard,
    Folder,
    Settings,
    Search,
    LogOut,
    X,
    Workflow
} from "lucide-react"
import { UserContext } from "../../../context/UserContext/UserContext"

export default function SidebarMenu({ isMenuOpen, onClose }) {
    const { user } = useContext(UserContext);

    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to log out?")
        if (confirmLogout) {
            // TODO: Handle logout logic here
            // await logout();
            // navigate('/login');
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

            <div className="flex items-center gap-4 mt-16 mb-8 px-4 py-3 rounded-lg mx-4" style={{ backgroundColor: 'var(--card-bg)' }}>
                <img 
                    src={user?.avatarUrl || "/assets/images/person.jpg"} 
                    alt="person" 
                    className="w-12 h-12 rounded-full object-cover" 
                />
                <div>
                    <p className="font-semibold" style={{ color: 'var(--primary-text-color)' }}>{user?.githubUsername || "Efrata"}</p>
                    <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>@{user?.githubUsername?.toLowerCase() || "zeamanuel"}</p>
                </div>
            </div>

            <hr className="my-4 mx-4" style={{ borderColor: 'var(--main-border-color)' }} />

            <div className="px-4 space-y-1">
                <NavLink 
                    to="/dashboard"
                    end
                    onClick={onClose}
                    className={({ isActive }) => 
                        `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                            isActive ? '' : 'hover:opacity-80'
                        }`
                    }
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--active-tab-bg)' : 'transparent',
                        color: isActive ? 'var(--active-text-color)' : 'var(--secondary-text-color)'
                    })}
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink 
                    to="/repositories"
                    onClick={onClose}
                    className={({ isActive }) => 
                        `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                            isActive ? '' : 'hover:opacity-80'
                        }`
                    }
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--active-tab-bg)' : 'transparent',
                        color: isActive ? 'var(--active-text-color)' : 'var(--secondary-text-color)'
                    })}
                >
                    <Folder size={20} />
                    <span>Repositories</span>
                </NavLink>

                <NavLink 
                    to="/workspaces"
                    onClick={onClose}
                    className={({ isActive }) => 
                        `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                            isActive ? '' : 'hover:opacity-80'
                        }`
                    }
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--active-tab-bg)' : 'transparent',
                        color: isActive ? 'var(--active-text-color)' : 'var(--secondary-text-color)'
                    })}
                >
                    <Workflow size={20} />
                    <span>Workspaces</span>
                </NavLink>

                <NavLink 
                    to="/profile"
                    onClick={onClose}
                    className={({ isActive }) => 
                        `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                            isActive ? '' : 'hover:opacity-80'
                        }`
                    }
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--active-tab-bg)' : 'transparent',
                        color: isActive ? 'var(--active-text-color)' : 'var(--secondary-text-color)'
                    })}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>

                <NavLink 
                    to="/explore"
                    onClick={onClose}
                    className={({ isActive }) => 
                        `flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                            isActive ? '' : 'hover:opacity-80'
                        }`
                    }
                    style={({ isActive }) => ({
                        backgroundColor: isActive ? 'var(--active-tab-bg)' : 'transparent',
                        color: isActive ? 'var(--active-text-color)' : 'var(--secondary-text-color)'
                    })}
                >
                    <Search size={20} />
                    <span>Explore</span>
                </NavLink>
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