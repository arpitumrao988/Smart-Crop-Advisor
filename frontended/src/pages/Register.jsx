// ============================================================
// Register.jsx — Registration Page (with multilanguage support)
// ============================================================

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";   // ← NEW
import { register as registerApi } from "../services/authService";
import AlertBanner from "../components/AlertBanner";
import "./AuthPages.css";

function Register() {
  const navigate = useNavigate();
  const { t }    = useLanguage();                           // ← NEW

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "", location: "",
  });
  const [loading,  setLoading]  = useState(false);
  const [alert,    setAlert]    = useState({ type: "", message: "" });
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setAlert({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.location) {
      setAlert({ type: "error", message: t.register.allRequired });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setAlert({ type: "error", message: t.register.passwordMismatch });
      return;
    }
    if (formData.password.length < 6) {
      setAlert({ type: "error", message: t.register.passwordShort });
      return;
    }

    setLoading(true);
    const result = await registerApi(
      formData.name, formData.email, formData.password, formData.location
    );
    setLoading(false);

    if (result.success) {
      setAlert({ type: "success", message: t.register.successMsg });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      setAlert({ type: "error", message: result.message });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">

        <div className="auth-header">
          <div className="auth-icon">🌱</div>
          <h1 className="auth-title">{t.register.title}</h1>
          <p className="auth-subtitle">{t.register.subtitle}</p>
        </div>

        {alert.message && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label" htmlFor="name">{t.register.nameLabel}</label>
              <input
                id="name" name="name" type="text"
                className="form-input"
                placeholder={t.register.namePlaceholder}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="location">{t.register.locationLabel}</label>
              <input
                id="location" name="location" type="text"
                className="form-input"
                placeholder={t.register.locationPlaceholder}
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">{t.register.emailLabel}</label>
            <input
              id="email" name="email" type="email"
              className="form-input"
              placeholder={t.register.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label" htmlFor="password">{t.register.passwordLabel}</label>
              <div className="input-with-toggle">
                <input
                  id="password" name="password"
                  type={showPass ? "text" : "password"}
                  className="form-input"
                  placeholder={t.register.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button type="button" className="toggle-password"
                  onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">{t.register.confirmLabel}</label>
              <input
                id="confirmPassword" name="confirmPassword"
                type={showPass ? "text" : "password"}
                className="form-input"
                placeholder={t.register.confirmPlaceholder}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit-btn" disabled={loading}>
            {loading ? (
              <><span className="btn-spinner" /> {t.register.creating}</>
            ) : (
              t.register.createBtn
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          {t.register.haveAccount}{" "}
          <Link to="/login" className="auth-link">{t.register.signInHere}</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
