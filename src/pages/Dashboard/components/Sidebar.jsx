import React, { useContext } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Folder, Workflow, Search, Settings, LogOut } from "lucide-react"
import { UserContext } from "../../../context/UserContext/UserContext"

export default function Sidebar() {
    const { user } = useContext(UserContext);

    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to log out?")
        if (confirmLogout) {
            // TODO: Handle logout logic here
            // await logout();
            // navigate('/login');
        }
    }

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Repositories", icon: Folder, path: "/repositories" },
        { name: "Workspaces", icon: Workflow, path: "/workspaces" },
        { name: "Explore", icon: Search, path: "/explore" },
        { name: "Profile", icon: Settings, path: "/profile" }
    ]

    return (
        <div className="flex flex-col h-full" style={{ 
            backgroundColor: 'var(--dark-bg)', 
            color: 'var(--secondary-text-color)', 
            padding: '1.5rem',
            borderRight: '1px solid var(--main-border-color)'
        }}>
            <div className="flex items-center gap-2 mb-10 px-2">
                <span className="text-2xl">🕸️</span>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-text-color)' }}>Dir</h1>
            </div>

            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--card-bg-lighter)' }}>
                    <img 
                        src={user?.avatarUrl || "/assets/images/person.jpg"} 
                        alt="User profile" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--primary-text-color)' }}>
                        {user?.githubUsername || "Zeamanuel Mbit"}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--secondary-text-color)' }}>
                        @{user?.githubUsername?.toLowerCase() || "zeaman"}
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        end={item.path === "/"}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                isActive 
                                    ? "" 
                                    : "hover:opacity-80"
                            }`
                        }
                        style={({ isActive }) => ({
                            backgroundColor: isActive ? 'var(--active-tab-bg)' : 'transparent',
                            color: isActive ? 'var(--active-text-color)' : 'var(--secondary-text-color)'
                        })}
                    >
                        <item.icon size={18} />
                        <span className="text-sm font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-4" style={{ borderTop: '1px solid var(--main-border-color)' }}>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                    style={{ color: '#ff4757' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff47571a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </div>
    )
}