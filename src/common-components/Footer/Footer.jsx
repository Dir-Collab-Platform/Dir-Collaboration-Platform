import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="container">Dir</div>
        <div className="container">2025</div>
        <div className="container">
          <img src="/images/copyright 1.png" alt="copyright" />
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