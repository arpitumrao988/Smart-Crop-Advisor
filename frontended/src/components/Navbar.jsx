// ============================================================
// Navbar.jsx — Top Navigation Bar
//
// Added: Language toggle button (EN ⇄ हिं) in top right
// Uses LanguageContext to switch and read language
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth }         from "../context/AuthContext";
import { useLanguage }     from "../context/LanguageContext";   // ← NEW
import "./Navbar.css";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { t, lang, toggleLanguage }  = useLanguage();           // ← NEW
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* ── Brand ─────────────────────────────────────────── */}
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🌾</span>
          <span className="brand-name">{t.navbar.brand}</span>
        </Link>

        {/* ── Desktop Nav Links ──────────────────────────────── */}
        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>

          <Link
            to="/"
            className={`nav-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {t.navbar.home}
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {t.navbar.dashboard}
              </Link>

              <div className="nav-dropdown">
                <span className="nav-link">{t.navbar.advisories}</span>
                <div className="dropdown-menu">
                  <Link to="/recommend/crop"       onClick={() => setMenuOpen(false)}>{t.navbar.crop}</Link>
                  <Link to="/recommend/fertilizer" onClick={() => setMenuOpen(false)}>{t.navbar.fertilizer}</Link>
                  <Link to="/recommend/irrigation" onClick={() => setMenuOpen(false)}>{t.navbar.irrigation}</Link>
                  <Link to="/disease/detect"       onClick={() => setMenuOpen(false)}>{t.navbar.disease}</Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Right Side: Language Toggle + Auth ─────────────── */}
        <div className="navbar-right">

          {/* ── Language Toggle Button ── */}
          {/* Clicking switches between English and Hindi */}
          <button
            className="lang-toggle-btn"
            onClick={toggleLanguage}
            title={lang === "en" ? "Switch to Hindi" : "Switch to English"}
          >
            {lang === "en" ? "🌐 हिं" : "🌐 EN"}
          </button>

          {isLoggedIn ? (
            <div className="navbar-user">
              <Link to="/profile" className="user-greeting">
                👨‍🌾 {user?.name}
              </Link>
              <button className="btn-logout" onClick={handleLogout}>
                {t.navbar.logout}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login"    className="btn-nav-login">{t.navbar.login}</Link>
              <Link to="/register" className="btn-nav-register">{t.navbar.register}</Link>
            </div>
          )}
        </div>

        {/* ── Mobile Hamburger ───────────────────────────────── */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;