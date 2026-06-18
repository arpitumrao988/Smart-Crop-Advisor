// ============================================================
// userService.js — User Profile API Calls
//
// 🔗 API CONNECTIONS IN THIS FILE:
//   GET    /api/v1/users/{userId} → getUserProfile()
//   PUT    /api/v1/users/{userId} → updateUserProfile()
//   DELETE /api/v1/users/{userId} → deleteAccount()
//
// All are PROTECTED — require JWT token
// ============================================================

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("sca_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ── getUserProfile() ─────────────────────────────────────────
// Called by: Profile.jsx on page load
//
// 🔗 API CALL: GET http://localhost:8080/api/v1/users/{userId}
//   ↓ Backend validates JWT
//   ↓ Backend queries MySQL: SELECT * FROM users WHERE id = ?
//   ↓ Returns full profile data
//
// RESPONSE:
//   { id, name, email, location, createdAt }
//
export const getUserProfile = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/users/${userId}`,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch profile.";
    return { success: false, message };
  }
};

// ── updateUserProfile() ──────────────────────────────────────
// Called by: Profile.jsx on save button click
//
// 🔗 API CALL: PUT http://localhost:8080/api/v1/users/{userId}
//   ↓ Backend validates JWT
//   ↓ Backend updates users table in MySQL
//   ↓ Returns updated user data
//
// REQUEST BODY:
//   { name, location }
//
// RESPONSE:
//   { message: "Profile updated successfully.", user: { name, location } }
//
export const updateUserProfile = async (userId, updateData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/users/${userId}`,
      updateData,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to update profile.";
    return { success: false, message };
  }
};

// ── deleteAccount() ──────────────────────────────────────────
// Called by: Profile.jsx on delete account confirmation
//
// 🔗 API CALL: DELETE http://localhost:8080/api/v1/users/{userId}
//   ↓ Backend validates JWT
//   ↓ Backend deletes user and all related records from MySQL
//   ↓ Returns success message
//
// RESPONSE:
//   { message: "Account deleted successfully." }
//
export const deleteAccount = async (userId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/users/${userId}`,
      getAuthHeaders()
    );
    return {
      success: true,
      message: response.data?.message || "Account deleted successfully.",
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to delete account.";
    return { success: false, message };
  }
};
// // ============================================================
// // userService.js — MOCK VERSION
// //
// // ⚠️  Backend is NOT running.
// // Reads/updates user data from localStorage only.
// // ============================================================

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // ── getUserProfile() ─────────────────────────────────────────
// // Simulates GET /api/v1/users/{userId}
// export const getUserProfile = async (userId) => {
//   await delay(700);

//   // Read stored user from localStorage
//   const stored = localStorage.getItem("sca_user");
//   const user = stored ? JSON.parse(stored) : null;

//   if (!user) {
//     return { success: false, message: "User not found." };
//   }

//   return {
//     success: true,
//     data: {
//       id:        user.userId,
//       name:      user.name,
//       email:     user.email,
//       location:  user.location || "Not set",
//       createdAt: "2025-01-15T10:00:00Z",
//     },
//   };
// };

// // ── updateUserProfile() ──────────────────────────────────────
// // Simulates PUT /api/v1/users/{userId}
// export const updateUserProfile = async (userId, updateData) => {
//   await delay(1000);

//   // Update localStorage
//   const stored = localStorage.getItem("sca_user");
//   if (stored) {
//     const user = JSON.parse(stored);
//     const updated = { ...user, ...updateData };
//     localStorage.setItem("sca_user", JSON.stringify(updated));
//   }

//   return {
//     success: true,
//     data: {
//       message: "Profile updated successfully.",
//       user: updateData,
//     },
//   };
// };

// // ── deleteAccount() ──────────────────────────────────────────
// // Simulates DELETE /api/v1/users/{userId}
// export const deleteAccount = async (userId) => {
//   await delay(1000);

//   // Clear localStorage
//   localStorage.removeItem("sca_user");
//   localStorage.removeItem("sca_token");

//   return {
//     success: true,
//     message: "Account deleted successfully.",
//   };
// };