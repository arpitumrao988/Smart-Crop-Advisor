// ============================================================
// Profile.jsx — User Profile Page
//
// 🔗 API CONNECTIONS:
//   GET    /api/v1/users/{userId}  → getUserProfile()     — on page load
//   PUT    /api/v1/users/{userId}  → updateUserProfile()  — on edit save
//   DELETE /api/v1/users/{userId}  → deleteAccount()      — on delete
//
// FLOW:
//   1. Page loads → GET /users/{id} to fetch profile data
//   2. User clicks Edit → fields become editable
//   3. User saves → PUT /users/{id} with updated data
//   4. AuthContext.updateUser() called to refresh stored name
//   5. Delete button → confirm dialog → DELETE /users/{id} → logout
// ============================================================

import React, { useState, useEffect } from "react";
import { useNavigate }                 from "react-router-dom";
import { useAuth }                     from "../context/AuthContext";
import { getUserProfile, updateUserProfile, deleteAccount } from "../services/userService";
import AlertBanner from "../components/AlertBanner";
import Loader      from "../components/Loader";
import "./Profile.css";
// In every page file add:
// import { useLanguage } from "../context/LanguageContext";

// Inside component add:
// const { t } = useLanguage();

// Then replace every hardcoded string:
// "Welcome back,"      → t("dash_welcome")
// "Total Advisories"   → t("dash_totalAdvisories")
// etc.

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────
  const [profile,   setProfile]   = useState(null);  // Full profile from API
  const [editMode,  setEditMode]  = useState(false);  // Is the form editable?
  const [formData,  setFormData]  = useState({ name: "", location: "" });
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [alert,     setAlert]     = useState({ type: "", message: "" });

  // ── Fetch profile on mount ────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) return;

      // ─────────────────────────────────────────────────────
      // 🔗 API CALL — GET /api/v1/users/{userId}
      //    Sent to: http://localhost:8080/api/v1/users/1
      //    Auth:    Bearer token
      //    Returns: { id, name, email, location, createdAt }
      // ─────────────────────────────────────────────────────
      const res = await getUserProfile(user.userId);
      setLoading(false);

      if (res.success) {
        setProfile(res.data);
        // Pre-fill the edit form with current values
        setFormData({ name: res.data.name, location: res.data.location || "" });
      } else {
        setAlert({ type: "error", message: res.message });
      }
    };

    fetchProfile();
  }, [user?.userId]);

  // ── handleSave() — called when Edit form is submitted ─────
  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setAlert({ type: "error", message: "Name cannot be empty." });
      return;
    }

    setSaving(true);

    // ─────────────────────────────────────────────────────────
    // 🔗 API CALL — PUT /api/v1/users/{userId}
    //    Sent to: http://localhost:8080/api/v1/users/1
    //    Auth:    Bearer token
    //    Body:    { name: "Ramesh Kumar", location: "Varanasi" }
    //    Returns: { message: "Profile updated successfully", user: {...} }
    // ─────────────────────────────────────────────────────────
    const res = await updateUserProfile(user.userId, {
      name:     formData.name.trim(),
      location: formData.location.trim(),
    });

    setSaving(false);

    if (res.success) {
      // Update local profile state
      setProfile(prev => ({ ...prev, name: formData.name, location: formData.location }));
      // Update AuthContext so Navbar shows the new name
      updateUser({ name: formData.name });
      setEditMode(false);
      setAlert({ type: "success", message: "Profile updated successfully!" });
    } else {
      setAlert({ type: "error", message: res.message });
    }
  };

  // ── handleDelete() — deletes account ─────────────────────
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account?\n\n" +
      "All your recommendations and data will be permanently deleted. " +
      "This cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);

    // ─────────────────────────────────────────────────────────
    // 🔗 API CALL — DELETE /api/v1/users/{userId}
    //    Sent to: http://localhost:8080/api/v1/users/1
    //    Auth:    Bearer token
    //    Returns: { message: "Account deleted successfully" }
    // ─────────────────────────────────────────────────────────
    const res = await deleteAccount(user.userId);
    setDeleting(false);

    if (res.success) {
      logout();             // Clear JWT and user from context
      navigate("/");        // Go to home page
    } else {
      setAlert({ type: "error", message: res.message });
    }
  };

  // ── Render ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper">
        <Loader message="Loading your profile..." fullPage />
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container profile-container">

        {/* ── Page Header ────────────────────────────────── */}
        <div className="profile-header">
          <h1 className="profile-title">👨‍🌾 My Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        {/* Alert for success/error messages */}
        {alert.message && (
          <AlertBanner
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ type: "", message: "" })}
          />
        )}

        <div className="profile-layout">

          {/* ── Left: Profile Card (Read-only view) ──────── */}
          <div className="profile-card card">
            <div className="profile-avatar">
              <span className="avatar-emoji">👨‍🌾</span>
            </div>
            <h2 className="profile-name">{profile?.name}</h2>
            <p className="profile-email">{profile?.email}</p>
            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-label">📍 Location</span>
                <span className="meta-value">{profile?.location || "Not set"}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">📅 Member since</span>
                <span className="meta-value">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Edit Form ─────────────────────────── */}
          <div className="profile-edit card">
            <div className="edit-header">
              <h2 className="edit-title">Edit Information</h2>
              {!editMode && (
                <button
                  className="btn-secondary edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {/* 
                Form is read-only by default
                Becomes editable when user clicks "Edit Profile"
            */}
            <form onSubmit={handleSave} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className={`form-input ${!editMode ? "input-readonly" : ""}`}
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  readOnly={!editMode}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-input input-readonly"
                  value={profile?.email || ""}
                  readOnly
                  title="Email cannot be changed"
                />
                <p className="field-tip">Email address cannot be changed after registration.</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="location">Location / Village</label>
                <input
                  id="location"
                  type="text"
                  className={`form-input ${!editMode ? "input-readonly" : ""}`}
                  placeholder="e.g. Varanasi, Uttar Pradesh"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  readOnly={!editMode}
                  disabled={saving}
                />
              </div>

              {/* Action buttons only visible in edit mode */}
              {editMode && (
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <><span className="btn-spinner" /> Saving...</> : "💾 Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({ name: profile.name, location: profile.location || "" });
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>

            {/* ── Danger Zone ──────────────────────────────── */}
            <div className="danger-zone">
              <div className="divider" />
              <h3 className="danger-title">⚠️ Danger Zone</h3>
              <p className="danger-desc">
                Deleting your account is permanent. All your recommendations and
                data will be permanently removed and cannot be recovered.
              </p>
              {/* 
                  Clicking this calls DELETE /api/v1/users/{userId}
                  then logout() and navigate to home
              */}
              <button
                className="btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "🗑️ Delete My Account"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;