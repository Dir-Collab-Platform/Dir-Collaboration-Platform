import React, { useState } from 'react';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle New Repository button click
  const handleNewRepoClick = () => {
    const createRepo = window.confirm('Create a new repository?');
    if (createRepo) {
      alert('Redirecting to repository creation...');
      // In real app: navigate('/create-repository');
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (itemName) => {
    alert(`Navigating to ${itemName}...`);  // FIXED: Backticks not single quotes
    setIsMenuOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      alert('Logging out...');
    }
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="nav">
        <div className="nav-container">
          {/* Left: Logo */}
          <div className="left-section">
            <div className="logo-div">
              <img 
                src="/images/Dir logo.png" 
                alt="logo" 
              />
            </div>
          </div>

          {/* Right: Button + Bell + Hamburger */}
          <div className="right-section">
            {/* Your New Repository Button */}
            <button
              onClick={handleNewRepoClick}
              className="new-repo-btn"
            >
              <img src="/images/plus 1.png" alt="plus" />
              <span>New Repository</span>
            </button>

            {/* Bell Icon */}
            <img 
              src="/images/bell 1.png" 
              alt="bell" 
              className="bell-icon"
            />

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="hamburger"
            >
              <img src="/images/menu 1.png" alt="menu" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isMenuOpen ? 'open' : ''}`}>  {/* FIXED: Backticks */}
        <button
          onClick={() => setIsMenuOpen(false)}
          className="close-btn"
        >
          <img src="/images/x 2.png" alt="close" />
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <img src="/images/person.jpg" alt="person" className="profile-pic" />
          <div className="user-info">
            <p className="user-name">Efrata</p>
            <p className="user-handle">@zeamanuel</p>
          </div>
        </div>

        <hr className="menu-divider" />

        {/* Menu Items */}
        <div className="menu-item" onClick={() => handleMenuItemClick('Dashboard')}>
          <img src="/images/layout-dashboard 1.png" alt="dashboard" />
          <span>Dashboard</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Explore')}>
          <img src="/images/search 1.png" alt="explore" />
          <span>Explore</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Repositories')}>
          <img src="/images/folder 2.png" alt="repos" />
          <span>Repositories</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Workspaces')}>
          <img src="/images/workspace 1.png" alt="workspace" />
          <span>Workspaces</span>
        </div>

        <div className="menu-item" onClick={() => handleMenuItemClick('Settings')}>
          <img src="/images/settings 1.png" alt="setting" />
          <span>Settings</span>
        </div>

        <hr className="menu-divider" />

        {/* Logout */}
        <div className="menu-item logout-item" onClick={handleLogout}>
          <img src="/images/log-out 1.png" alt="logout" />
          <span>Log out</span>
        </div>
      </div>

      {/* Overlay */}
      <div 
        className={`menu-overlay ${isMenuOpen ? 'active' : ''}`}  // FIXED: Backticks
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
}

export default Header;