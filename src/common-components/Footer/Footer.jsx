import React from 'react';
import { Copyright } from 'lucide-react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="container">Dir</div>
        <div className="container">2025</div>
        <div className="container">
          <Copyright size={16} />
        </div>
        <div className="container">All rights reserved</div>
        <div className="container"><a href="#">Docs</a></div>
        <div className="container"><a href="#">Terms of use</a></div>
        <div className="container"><a href="#">Privacy</a></div>
      </div>
    </footer>
  );
}

export default Footer;