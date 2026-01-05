import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Folder,
  Settings,
  Search,
  LogOut,
  X,
  Workflow
} from 'lucide-react';

function SidebarMenu({ isMenuOpen, onClose }) {
  const navigate = useNavigate();

  const handleMenuItemClick = (itemName) => {
    const routeMap = {
      'Dashboard': '/',
      'Repositories': '/repositories',
      'Workspaces': '/workspaces'
    };
    
    const route = routeMap[itemName];
    if (route) {
      navigate(route);
    }
    
    onClose();
  };

  return (
    <div 
      className={`fixed top-0 right-0 w-80 h-screen z-50 transition-transform duration-300 overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{
        backgroundColor: 'var(--dark-bg)',
        borderLeft: '1px solid rgba(239, 238, 238, 0.28)'
      }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 p-2 rounded-md"
        style={{ color: 'var(--secondary-text-color)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
          e.currentTarget.style.color = 'var(--primary-text-color)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--secondary-text-color)';
        }}
      >
        <X size={20} />
      </button>

      <div 
        className="flex items-center gap-4 mt-16 mb-8 px-4 py-3 rounded-lg mx-4"
        style={{ backgroundColor: 'var(--card-bg)' }}
      >
        <img src="/assets/images/person.jpg" alt="person" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold" style={{ color: 'var(--primary-text-color)' }}>Efrata</p>
          <p className="text-sm" style={{ color: 'var(--secondary-text-color)' }}>@zeamanuel</p>
        </div>
      </div>

      <hr className="my-4 mx-4" style={{ borderColor: 'rgba(239, 238, 238, 0.2)' }} />

      <div className="px-4 space-y-1">
        <button 
          onClick={() => handleMenuItemClick('Dashboard')}
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
          style={{ color: 'var(--secondary-text-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
            e.currentTarget.style.color = 'var(--primary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--secondary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
          }}
        >
          <LayoutDashboard size={20} style={{ color: 'var(--secondary-text-color)' }} />
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => navigate('/repositories')}
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
          style={{ color: 'var(--secondary-text-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
            e.currentTarget.style.color = 'var(--primary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--secondary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
          }}
        >
          <Folder size={20} style={{ color: 'var(--secondary-text-color)' }} />
          <span>Repositories</span>
        </button>

        <button 
          onClick={() => navigate('/workspaces')}
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
          style={{ color: 'var(--secondary-text-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
            e.currentTarget.style.color = 'var(--primary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--secondary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
          }}
        >
          <Workflow size={20} style={{ color: 'var(--secondary-text-color)' }} />
          <span>Workspaces</span>
        </button>

        <button 
          onClick={() => {
            onClose();
            
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
          style={{ color: 'var(--secondary-text-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
            e.currentTarget.style.color = 'var(--primary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--secondary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
          }}
        >
          <Settings size={20} style={{ color: 'var(--secondary-text-color)' }} />
          <span>Settings</span>
        </button>

        <button 
          onClick={() => handleMenuItemClick('Explore')}
          className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors"
          style={{ color: 'var(--secondary-text-color)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--secondary-button-hover)';
            e.currentTarget.style.color = 'var(--primary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--primary-text-color)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--secondary-text-color)';
            e.currentTarget.querySelector('svg').style.color = 'var(--secondary-text-color)';
          }}
        >
          <Search size={20} style={{ color: 'var(--secondary-text-color)' }} />
          <span>Explore</span>
        </button>
      </div>

      <hr className="my-4 mx-4" style={{ borderColor: 'rgba(239, 238, 238, 0.2)' }} />

      <button 
        onClick={() => {
          const confirmLogout = window.confirm('Are you sure you want to log out?');
          if (confirmLogout) {
            // Handle logout logic here
          }
          onClose();
        }}
        className="flex items-center gap-3 w-full p-3 rounded-lg transition-colors mx-4"
        style={{ color: '#ff4757' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <LogOut size={20} style={{ color: '#ff4757' }} />
        <span>Log out</span>
      </button>
    </div>
  );
}

export default SidebarMenu;