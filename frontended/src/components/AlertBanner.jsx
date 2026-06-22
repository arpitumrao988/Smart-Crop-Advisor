// ============================================================
// AlertBanner.jsx — Reusable Alert / Notification Component
//
// Displays success (green), error (red), or info (blue) messages
// Used on Login, Register, Dashboard, and all advisory pages
//
// Props:
//   type    — "success" | "error" | "info" | "warning"
//   message — The text to display
//   onClose — Optional: function to call when X is clicked
//
// NO API CALLS in this component
// ============================================================

import React from "react";
import "./AlertBanner.css";

function AlertBanner({ type = "info", message, onClose }) {
  // Map type to emoji icon
  const icons = {
    success: "✅",
    error:   "❌",
    warning: "⚠️",
    info:    "ℹ️",
  };

  // Don't render if no message
  if (!message) return null;

  return (
    <div className={`alert-banner alert-${type}`} role="alert">
      <span className="alert-icon">{icons[type]}</span>
      <span className="alert-message">{message}</span>
      {/* Show close button only if onClose handler is provided */}
      {onClose && (
        <button className="alert-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
}

export default AlertBanner;