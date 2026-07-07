// ============================================================
// authService.js — Authentication API Calls
//
// 🔗 API CONNECTIONS IN THIS FILE:
//   POST /api/v1/auth/register → register()
//   POST /api/v1/auth/login    → login()
//
// Both are PUBLIC — no JWT token required
// ============================================================

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ── register() ───────────────────────────────────────────────
// Called by: Register.jsx on form submit
//
//  API CALL: POST http://localhost:8080/api/v1/auth/register
//   ↓ Backend validates input
//   ↓ Backend saves new user to MySQL (users table)
//   ↓ Returns success message
//
// REQUEST BODY:
//   { name, email, password, location }
//
// RESPONSE:
//   { success: true, message: "..." }
//
export const register = async (name, email, password, location) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name,
      email,
      password,
      location,
    });

    return {
      success: true,
      message: response.data?.message || "Account created successfully! You can now login.",
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Registration failed. Please try again.";
    return { success: false, message };
  }
};

// ── login() ──────────────────────────────────────────────────
// Called by: Login.jsx on form submit
//
// 🔗 API CALL: POST http://localhost:8080/api/v1/auth/login
//   ↓ Backend validates credentials
//   ↓ Backend generates JWT token
//   ↓ Returns token + user info
//
// REQUEST BODY:
//   { email, password }
//
// RESPONSE:
//   { token: "eyJhbGci...", userId: 1, name: "Ramesh", email: "..." }
//
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    const data = response.data;

    return {
      success: true,
      token: data.token,
      user: {
        userId: data.userId,
        name:   data.name,
        email:  data.email,
      },
    };
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Invalid email or password. Please try again.";
    return { success: false, message };
  }
};