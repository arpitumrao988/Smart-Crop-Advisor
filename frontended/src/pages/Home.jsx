// ============================================================
// Home.jsx — Landing Page (with multilanguage support)
// ============================================================

import React from "react";
import { Link } from "react-router-dom";
import { useAuth }     from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";   // ← NEW
import "./Home.css";

function Home() {
  const { isLoggedIn } = useAuth();
  const { t } = useLanguage();                              // ← NEW

  const icons = ["🌾", "💊", "💧", "🦠"];
  const stepIcons = ["📝", "🤖", "💡", "📊"];

  return (
    <div className="page-wrapper">

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">{t.home.badge}</div>
            <h1 className="hero-title">
              {t.home.heroTitle}<br />
              <span className="hero-highlight">{t.home.heroHighlight}</span>
            </h1>
            <p className="hero-description">{t.home.heroDesc}</p>

            <div className="hero-actions">
              {isLoggedIn ? (
                <Link to="/dashboard" className="btn-primary hero-btn-primary">
                  {t.home.goToDashboard}
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary hero-btn-primary">
                    {t.home.getStarted}
                  </Link>
                  <Link to="/login" className="btn-secondary hero-btn-secondary">
                    {t.home.loginBtn}
                  </Link>
                </>
              )}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">99%</span>
                <span className="stat-label">{t.home.statAccuracy}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">22+</span>
                <span className="stat-label">{t.home.statCrops}</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-value">3</span>
                <span className="stat-label">{t.home.statModels}</span>
              </div>
            </div>
          </div>

          <div className="hero-illustration" aria-hidden="true">
            <div className="illustration-circle">
              <span className="illustration-main">🌾</span>
            </div>
            <div className="floating-badge fb-1">🤖 AI Powered</div>
            <div className="floating-badge fb-2">📊 Data Driven</div>
            <div className="floating-badge fb-3">💧 Smart Irrigation</div>
          </div>
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>{t.home.whatWeOffer}</h2>
            <p>{t.home.whatWeOfferSub}</p>
          </div>
          <div className="features-grid">
            {t.home.features.map((f, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">{icons[idx]}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className="how-section">
        <div className="container">
          <div className="section-header">
            <h2>{t.home.howItWorks}</h2>
            <p>{t.home.howItWorksSub}</p>
          </div>
          <div className="steps-grid">
            {t.home.steps.map((s, idx) => (
              <div key={idx} className="step-card">
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{stepIcons[idx]}</div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ─────────────────────────────────────── */}
      <section className="tech-section">
        <div className="container">
          <div className="section-header">
            <h2>{t.home.builtWith}</h2>
            <p>{t.home.builtWithSub}</p>
          </div>
          <div className="tech-grid">
            <div className="tech-item"><span>⚛️</span> React.js 18</div>
            <div className="tech-item"><span>🍃</span> Spring Boot 3</div>
            <div className="tech-item"><span>🐍</span> Python + Scikit-Learn</div>
            <div className="tech-item"><span>🗄️</span> MySQL 8</div>
            <div className="tech-item"><span>🔐</span> JWT Auth</div>
            <div className="tech-item"><span>🤖</span> Random Forest ML</div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      {!isLoggedIn && (
        <section className="cta-section">
          <div className="container">
            <h2>{t.home.ctaTitle}</h2>
            <p>{t.home.ctaDesc}</p>
            <Link to="/register" className="btn-primary cta-btn">
              {t.home.ctaBtn}
            </Link>
          </div>
        </section>
      )}

    </div>
  );
}

export default Home;
