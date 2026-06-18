// ============================================================
// Footer.jsx — Bottom footer shown on all pages
// Static component — NO API calls
// ============================================================

import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span>🌾</span>
            <span>Smart Crop Advisor</span>
          </div>
          <p className="footer-tagline">
            AI-Powered Agricultural Advisory System
          </p>
          <p className="footer-team">
            Built with 💚 by Anubhav Tripathi, Arpit Umrao & Arpit Gupta
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Smart Crop Advisor — First Team Project
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;