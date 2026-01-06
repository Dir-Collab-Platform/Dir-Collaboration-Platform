import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Folder, Workflow, Search, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Repositories', icon: Folder },
    { name: 'Workspaces', icon: Workflow },
    { name: 'Explore', icon: Search },
    { name: 'Profile', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0D0D12] text-gray-400 p-6 border-r border-white/5">
      <div className="flex items-center gap-2 mb-10 px-2">
        <span className="text-2xl">🕸️</span>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dir</h1>
      </div>

      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gray-600 rounded-full flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">Zeamanuel Mbit</p>
          <p className="text-xs text-gray-500 truncate">@zeaman</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.name === 'Dashboard' ? '/' : `/${item.name.toLowerCase()}`)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
              item.active ? 'bg-[#1D1D29] text-[#6366F1]' : 'hover:bg-white/5'
            }`}
          >
            <item.icon size={18} />
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/5">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-2.5 hover:text-white cursor-pointer"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Log out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;