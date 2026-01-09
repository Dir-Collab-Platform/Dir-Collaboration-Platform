import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';

import CreateRepoModal from './components/CreateRepoModal';
import SidebarMenu from './components/SidebarMenu';
import NotificationBell from './components/NotificationBell';
import Logo from '../Logo';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateRepoOpen, setIsCreateRepoOpen] = useState(false);

  const handleNewRepoClick = () => {
    setIsCreateRepoOpen(true);
  };

  const handleCloseCreateRepo = () => {
    setIsCreateRepoOpen(false);
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (isCreateRepoOpen) {
          handleCloseCreateRepo();
        }
      }
    };

    if (isCreateRepoOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isCreateRepoOpen]);

  return (
    <>
      <nav
        className="p-4 fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: 'var(--dark-bg)',
          borderBottom: '1px solid var(--main-border-color)'
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <Logo />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleNewRepoClick}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: 'var(--primary-button)',
                color: 'var(--primary-text-color)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-button)'}
            >
              <Plus size={16} />
              <span>New Repository</span>
            </button>

            <NotificationBell />

            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-md transition-colors"
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
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <SidebarMenu
        isMenuOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      {isCreateRepoOpen && (
        <CreateRepoModal
          onClose={handleCloseCreateRepo}
        />
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className="pt-8"></div>
    </>
  );
}

export default Header;
