// ============================================================
// index.js — The very first file that runs
// This mounts the React app into the HTML page
// ============================================================

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";      // Global styles loaded here
import App from "./App";   // Root React component

// Find the <div id="root"> in public/index.html and mount React there
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // StrictMode helps catch bugs during development
  // It renders components twice in dev mode to detect side effects
  <React.StrictMode>
    <App />
  </React.StrictMode>
);