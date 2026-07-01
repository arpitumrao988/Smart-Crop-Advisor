// ============================================================
// Dashboard.jsx — Main Page After Login (with multilanguage)
// ============================================================

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth }     from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";   // ← NEW
import { translateTerm } from "../translations/translations";
import { getRecommendationHistory } from "../services/recommendService";
import AlertBanner from "../components/AlertBanner";
import Loader from "../components/Loader";
import "./Dashboard.css";

function Dashboard() {
  const { user }  = useAuth();
  const { t, language } = useLanguage();                          // ← NEW

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  // Quick action labels read from translations
  const quickActions = [
    { icon: "🌾", label: t.navbar.crop.replace("🌾 ", ""),       to: "/recommend/crop",       color: "green"  },
    { icon: "💊", label: t.navbar.fertilizer.replace("💊 ", ""), to: "/recommend/fertilizer", color: "blue"   },
    { icon: "💧", label: t.navbar.irrigation.replace("💧 ", ""), to: "/recommend/irrigation", color: "cyan"   },
    { icon: "🦠", label: t.navbar.disease.replace("🦠 ", ""),    to: "/disease/detect",       color: "orange" },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.userId) return;
      const result = await getRecommendationHistory(user.userId);
      setLoading(false);
      if (result.success) setHistory(result.data);
      else setError(result.message);
    };
    fetchHistory();
  }, [user?.userId]);

  const totalRecommendations = history.length;
  const cropCount  = history.filter(h => h.type === "CROP").length;
  const fertCount  = history.filter(h => h.type === "FERTILIZER").length;
  const lastDate   = history.length > 0
    ? new Date(history[0].createdAt).toLocaleDateString()
    : t.dashboard.never;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: "32px", paddingBottom: "48px" }}>

        {/* ── Welcome Header ─────────────────────────────── */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-greeting">
              🌾 {t.dashboard.greeting}, {user?.name || "Farmer"}!
            </h1>
            <p className="dashboard-subtitle">{t.dashboard.subtitle}</p>
          </div>
          <Link to="/profile" className="btn-secondary dashboard-profile-btn">
            👨‍🌾 {t.profile.title}
          </Link>
        </div>

        {/* ── Stats Cards ────────────────────────────────── */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#e8f5e9", color: "#2e7d32" }}>📊</div>
            <div>
              <p className="stat-card-value">{totalRecommendations}</p>
              <p className="stat-card-label">{t.dashboard.totalRec}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#e3f2fd", color: "#1565c0" }}>🌾</div>
            <div>
              <p className="stat-card-value">{cropCount}</p>
              <p className="stat-card-label">{t.dashboard.cropRec}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#fff8e1", color: "#f57f17" }}>💊</div>
            <div>
              <p className="stat-card-value">{fertCount}</p>
              <p className="stat-card-label">{t.dashboard.fertRec}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{ background: "#fce4ec", color: "#c62828" }}>📅</div>
            <div>
              <p className="stat-card-value">{lastDate}</p>
              <p className="stat-card-label">{t.dashboard.lastActive}</p>
            </div>
          </div>
        </div>

        {/* ── Quick Actions ──────────────────────────────── */}
        <section className="dashboard-section">
          <h2 className="section-title">{t.dashboard.quickActions}</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.to} className={`quick-action-card qac-${action.color}`}>
                <span className="qac-icon">{action.icon}</span>
                <span className="qac-label">{action.label}</span>
                <span className="qac-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── History Table ──────────────────────────────── */}
        <section className="dashboard-section">
          <h2 className="section-title">{t.dashboard.recentRec}</h2>
          <div className="card">
            {error   && <AlertBanner type="error" message={error} />}
            {loading && <Loader message={t.common.loading} />}

            {!loading && !error && history.length === 0 && (
              <div className="empty-state">
                <span className="empty-icon">🌱</span>
                <p>{t.dashboard.noRec}</p>
                <p className="text-muted">{t.dashboard.noRecSub}</p>
                <Link to="/recommend/crop" className="btn-primary mt-16">
                  {t.dashboard.getFirstRec}
                </Link>
              </div>
            )}

            {!loading && !error && history.length > 0 && (
              <div className="table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{t.dashboard.type}</th>
                      <th>{t.dashboard.result}</th>
                      <th>{t.dashboard.confidence}</th>
                      <th>{t.dashboard.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 10).map((item, idx) => (
                      <tr key={item.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <span className={`badge badge-${
                            item.type === "CROP"       ? "green" :
                            item.type === "FERTILIZER" ? "blue"  :
                            item.type === "IRRIGATION" ? "blue"  : "yellow"
                          }`}>
                            {language === "hi" 
                              ? (item.type === "CROP" ? "फसल" : 
                                 item.type === "FERTILIZER" ? "उर्वरक" : 
                                 item.type === "IRRIGATION" ? "सिंचाई" : "रोग")
                              : item.type
                            }
                          </span>
                        </td>
                        <td className="result-cell">{translateTerm(item.result, language)}</td>
                        <td>{item.confidence ? `${item.confidence}%` : t.dashboard.na}</td>
                        <td className="date-cell">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

export default Dashboard;