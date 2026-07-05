// ============================================================
// diseaseService.js — Disease Detection API Calls
//
// 🔗 API CONNECTIONS IN THIS FILE:
//   POST /api/v1/disease/detect → detectDisease()
//   GET  /api/v1/disease/list   → getDiseaseList()
//
// Both are PROTECTED — require JWT token
// ============================================================

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Reads JWT from localStorage and builds Authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem("sca_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ── detectDisease() ──────────────────────────────────────────
// Called by: DiseaseDetect.jsx on form submit
//
// 🔗 API CALL: POST http://localhost:8080/api/v1/disease/detect
//   ↓ Backend validates JWT
//   ↓ Backend calls Python AI: POST http://localhost:5000/predict/disease
//   ↓ AI model returns predicted disease
//   ↓ Backend fetches disease details from disease_info MySQL table
//   ↓ Returns full disease info to frontend
//
// REQUEST BODY:
//   { cropName: "Tomato", symptoms: ["yellow leaves", "brown spots"] }
//
// RESPONSE:
//   { disease, description, severity, treatment, prevention }
//
export const detectDisease = async (cropName, symptoms) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/disease/detect`,
      { cropName, symptoms },
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Disease detection failed.";
    return { success: false, message };
  }
};

// ── getDiseaseList() ─────────────────────────────────────────
// Called by: DiseaseDetect.jsx on page load
// Fetches the list of all crops and diseases the system supports
//
// 🔗 API CALL: GET http://localhost:8080/api/v1/disease/list
//   ↓ Backend validates JWT
//   ↓ Backend queries disease_info table in MySQL
//   ↓ Returns list of all supported diseases
//
// RESPONSE:
//   [ { id, cropName, diseaseName }, ... ]
//
export const getDiseaseList = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/disease/list`,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: "Failed to fetch disease list." };
  }
};