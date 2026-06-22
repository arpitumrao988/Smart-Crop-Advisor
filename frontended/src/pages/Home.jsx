<<<<<<< HEAD
import React from "react";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f4",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px 80px",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            color: "#2e7d32",
            marginBottom: "20px",
          }}
        >
          🌾 Smart Crop Advisor
        </h1>

        <p
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            fontSize: "20px",
            lineHeight: "1.8",
            color: "#555",
          }}
        >
          A modern agricultural advisory platform designed to assist
          farmers in making better decisions related to crop selection,
          fertilizer usage, irrigation planning, and crop disease
          management.
        </p>

        <div style={{ marginTop: "40px" }}>
          <button
            style={{
              padding: "14px 30px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              marginRight: "15px",
            }}
          >
            Login
          </button>

          <button
            style={{
              padding: "14px 30px",
              background: "white",
              color: "#2e7d32",
              border: "2px solid #2e7d32",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Register
          </button>
        </div>
      </div>

      {/* About Section */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            marginBottom: "20px",
          }}
        >
          About The Project
        </h2>

        <p
          style={{
            color: "#555",
            lineHeight: "1.8",
            fontSize: "17px",
          }}
        >
          Smart Crop Advisor is a web-based platform that helps users
          access agricultural guidance through crop recommendations,
          fertilizer suggestions, irrigation support, and disease
          identification services. The objective is to provide a simple,
          organized, and user-friendly environment for agricultural
          decision-making.
        </p>
      </div>

      {/* Features */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "60px auto",
          padding: "20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "40px",
          }}
        >
          Our Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🌱 Crop Recommendation</h3>
            <p>
              Identify suitable crops based on agricultural conditions
              and available inputs.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🧪 Fertilizer Guidance</h3>
            <p>
              Receive recommendations for fertilizer usage according to
              crop and soil requirements.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>💧 Irrigation Advisory</h3>
            <p>
              Support irrigation planning through water requirement
              guidance and scheduling.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🦠 Disease Detection</h3>
            <p>
              Assist users in identifying crop diseases and possible
              treatment measures.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "80px",
          textAlign: "center",
          padding: "25px",
          background: "#2e7d32",
          color: "white",
        }}
      >
        <p>© 2026 Smart Crop Advisor. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
=======
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
>>>>>>> d11086cb83807ad3d6a3645ab661755b31e39763
