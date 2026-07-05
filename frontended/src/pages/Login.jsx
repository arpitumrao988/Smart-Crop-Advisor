// ============================================================
// Login.jsx — Login Page (with multilanguage support)
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth }     from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";   // ← NEW
import { login as loginApi } from "../services/authService";
import AlertBanner from "../components/AlertBanner";
import Loader from "../components/Loader";
import "./AuthPages.css";

function Login() {
  const { login }   = useAuth();
  const { t }       = useLanguage();                        // ← NEW
  const navigate    = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading,      setLoading]      = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage(t.login.fillBoth);
      return;
    }
    setLoading(true);
    setErrorMessage("");

    const result = await loginApi(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      login(result.token, result.user);
      navigate("/dashboard");
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-header">
          <div className="auth-icon">🌾</div>
          <h1 className="auth-title">{t.login.title}</h1>
          <p className="auth-subtitle">{t.login.subtitle}</p>
        </div>

        {errorMessage && (
          <AlertBanner
            type="error"
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              {t.login.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder={t.login.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              {t.login.passwordLabel}
            </label>
            <div className="input-with-toggle">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder={t.login.passwordPlaceholder}
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <><span className="btn-spinner" /> {t.login.signingIn}</>
            ) : (
              t.login.signInBtn
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          {t.login.noAccount}{" "}
          <Link to="/register" className="auth-link">
            {t.login.createHere}
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;