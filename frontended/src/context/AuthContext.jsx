// ============================================================
// AuthContext.jsx — Global Authentication State
//
// PURPOSE:
//   Stores the JWT token and user info after login.
//   Any component in the app can read this using useAuth().
//   Persists login state across page refreshes using localStorage.
//
// HOW IT WORKS:
//   - After login, authService.login() returns { token, userId, name }
//   - Login page calls login() from this context to save that data
//   - Axios interceptor (in each service file) reads the token
//     from here and adds it to every API request header
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the context object
const AuthContext = createContext(null);

// 2. AuthProvider — wraps the entire app in App.jsx
export function AuthProvider({ children }) {

  // ── State ────────────────────────────────────────────────
  // Token and user are read from localStorage on page load
  // This way, refreshing the browser doesn't log the user out
  const [token, setToken]   = useState(() => localStorage.getItem("sca_token") || null);
  const [user,  setUser]    = useState(() => {
    const saved = localStorage.getItem("sca_user");
    return saved ? JSON.parse(saved) : null;
  });

  // ── login() ──────────────────────────────────────────────
  // Called by Login.jsx after a successful POST /auth/login response
  // Saves token and user info to both state and localStorage
  const login = (tokenValue, userData) => {
    setToken(tokenValue);
    setUser(userData);
    localStorage.setItem("sca_token", tokenValue);
    localStorage.setItem("sca_user",  JSON.stringify(userData));
  };

  // ── logout() ─────────────────────────────────────────────
  // Called by Navbar logout button or by Axios 401 interceptor
  // Clears all auth state from memory and localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sca_token");
    localStorage.removeItem("sca_user");
  };

  // ── updateUser() ─────────────────────────────────────────
  // Called by Profile.jsx after a successful PUT /users/{id}
  // Updates the stored user info without requiring re-login
  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem("sca_user", JSON.stringify(merged));
  };

  // ── Value exposed to all child components ─────────────────
  const value = {
    token,        // The JWT string (null if not logged in)
    user,         // { userId, name, email } (null if not logged in)
    isLoggedIn: !!token, // Boolean shortcut for auth check
    login,        // Function to call after successful login
    logout,       // Function to call to log out
    updateUser,   // Function to call after profile update
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. useAuth — custom hook for easy context consumption
// Usage in any component: const { token, user, login, logout } = useAuth();
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}

export default AuthContext;