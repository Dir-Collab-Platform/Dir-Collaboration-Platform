import React, { useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { LayoutDashboard, Folder, Workflow, Search, Settings, LogOut } from "lucide-react"
import { useAuth } from "../../../context/AuthContext/AuthContext"
import Avatar from "../../Workspace/components/Chat/Avatar";
import Logo from "../../../common-components/Logo";

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        const confirmLogout = window.confirm("Are you sure you want to log out?")
        if (confirmLogout) {
            logout();
            navigate('/');
        }
    }

    const navItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { name: "Repositories", icon: Folder, path: "/repositories" },
        { name: "Workspaces", icon: Workflow, path: "/workspaces" },
        { name: "Explore", icon: Search, path: "/explore" },
        { name: "Profile", icon: Settings, path: "/profile" }
    ]

    return (
        <div className="flex flex-col h-full bg-(--bg-main) text-(--text-secondary) p-6 border-r border-(--border-main)">
            <Logo className="mb-10 "/>

            <div className="flex items-center gap-3 mb-10 px-2 py-3 bg-(--bg-card) rounded-2xl border border-(--border-main) shadow-sm">
                <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-(--bg-dim)">
                    <Avatar
                        src={user?.avatarUrl}
                        size={40}
                        alt="User profile"
                    />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold truncate text-(--text-primary)">
                        {user?.githubUsername || "Guest"}
                    </p>
                    <p className="text-[10px] font-mono tracking-widest truncate text-(--text-secondary) opacity-50">
                        @{user?.githubUsername?.toLowerCase() || "anon"}
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
                            `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive
                                ? "bg-(--bg-active) text-(--text-active) shadow-sm border border-(--text-active)/10"
                                : "text-(--text-secondary) hover:bg-(--bg-card-hover) hover:text-(--text-primary)"
                            }`
                        }
                    >
                        <item.icon size={18} />
                        <span className="text-sm font-semibold">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-4 border-t border-(--border-main)">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all text-[#ff4757] hover:bg-[#ff47571a] cursor-pointer font-semibold"
                >
                    <LogOut size={18} />
                    <span className="text-sm">Log out</span>
                </button>
            </div>
        </div>
    )
}