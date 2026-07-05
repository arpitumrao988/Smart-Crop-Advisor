// ============================================================
// Loader.jsx — Loading Spinner Component
//
// Shown while waiting for API responses
// Prevents the user from seeing a blank/empty page during fetch
//
// Props:
//   message — Optional text shown below spinner (default: "Loading...")
//   fullPage — If true, covers the entire screen; if false, inline
//
// NO API CALLS in this component
// ============================================================

import React from "react";
import "./Loader.css";

function Loader({ message = "Loading...", fullPage = false }) {
  return (
    <div className={`loader-wrapper ${fullPage ? "loader-fullpage" : ""}`}>
      {/* CSS animated spinner ring */}
      <div className="loader-spinner">
        <div className="spinner-ring"></div>
        <span className="spinner-icon">🌾</span>
      </div>
      <p className="loader-message">{message}</p>
    </div>
  );
}

export default Loader;