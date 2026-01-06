import React from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Folder, Workflow, Search, Settings, LogOut } from "lucide-react"

export default function Sidebar({ user }) {
    const location = useLocation()

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Repositories", icon: Folder, path: "/repositories" },
        { name: "Workspaces", icon: Workflow, path: "/workspaces" },
        { name: "Explore", icon: Search, path: "/explore" },
        { name: "Profile", icon: Settings, path: "/profile" }
    ]

    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to log out?")
        if (confirmLogout) {
            // Handle logout logic here
        }
    }

    return (
        <div className="flex flex-col h-full bg-(--dark-bg) text-(--secondary-text-color) p-6 border-r border-(--main-border-color)">
            <div className="flex items-center gap-2 mb-10 px-2">
                <span className="text-2xl">🕸️</span>
                <h1 className="text-2xl font-bold text-(--primary-text-color) tracking-tight">Dir</h1>
            </div>

            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 bg-(--card-bg-lighter) rounded-full flex-shrink-0 overflow-hidden">
                    <img 
                        src="/assets/images/person.jpg" 
                        alt="User profile" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--primary-text-color) truncate">
                        {user?.name || "Zeamanuel Mbit"}
                    </p>
                    <p className="text-xs text-(--secondary-text-color) truncate">
                        {user?.username || "@zeaman"}
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map(function(item) {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                                isActive 
                                    ? "bg-(--active-tab-bg) text-(--active-text-color)" 
                                    : "hover:bg-(--secondary-button-hover) hover:text-(--primary-text-color)"
                            }`}
                        >
                            <item.icon size={18} />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="pt-4 border-t border-(--main-border-color)">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[#ff4757] hover:bg-[#ff47571a] rounded-lg transition-colors cursor-pointer"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Log out</span>
                </button>
            </div>
        </div>
    )
}