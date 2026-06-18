// ============================================================
// recommendService.js — Recommendation API Calls
//
// 🔗 API CONNECTIONS IN THIS FILE:
//   POST /api/v1/recommend/crop         → getCropRecommendation()
//   POST /api/v1/recommend/fertilizer   → getFertilizerRecommendation()
//   POST /api/v1/recommend/irrigation   → getIrrigationAdvisory()
//   GET  /api/v1/recommend/history/{id} → getRecommendationHistory()
//
// All are PROTECTED — backend requires JWT token
// Token is injected automatically by getAuthHeaders()
// ============================================================

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

// ── getAuthHeaders() ─────────────────────────────────────────
// Reads the JWT token from localStorage and builds the header object
// The Spring Security JWT filter on the backend reads this header
// Header format: { Authorization: "Bearer eyJhbGci..." }
const getAuthHeaders = () => {
  const token = localStorage.getItem("sca_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ── getCropRecommendation() ───────────────────────────────────
// Called by: CropRecommend.jsx on form submit
//
// 🔗 API CALL: POST http://localhost:8080/api/v1/recommend/crop
//   ↓ Backend validates JWT
//   ↓ Backend saves soil input to MySQL (soil_inputs table)
//   ↓ Backend calls Python AI module: POST http://localhost:5000/predict/crop
//   ↓ AI module returns prediction
//   ↓ Backend saves recommendation to MySQL (recommendations table)
//   ↓ Backend returns prediction to frontend
//
// REQUEST BODY:
//   { N, P, K, temperature, humidity, ph, rainfall }
//
// RESPONSE:
//   { recommendedCrop, confidence, alternatives, advisoryNote, savedAt }
//
export const getCropRecommendation = async (soilData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/recommend/crop`,
      soilData,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Crop recommendation failed.";
    return { success: false, message };
  }
};

// ── getFertilizerRecommendation() ────────────────────────────
// Called by: FertilizerRecommend.jsx on form submit
//
// 🔗 API CALL: POST http://localhost:8080/api/v1/recommend/fertilizer
//   ↓ Backend validates JWT
//   ↓ Backend calls Python AI module: POST http://localhost:5000/predict/fertilizer
//   ↓ Returns fertilizer recommendation
//
// REQUEST BODY:
//   { cropName, soilType, nitrogen, phosphorus, potassium }
//
// RESPONSE:
//   { fertilizer, quantity, guidance, savedAt }
//
export const getFertilizerRecommendation = async (fertData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/recommend/fertilizer`,
      fertData,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Fertilizer recommendation failed.";
    return { success: false, message };
  }
};

// ── getIrrigationAdvisory() ───────────────────────────────────
// Called by: IrrigationAdvisory.jsx on form submit
//
// 🔗 API CALL: POST http://localhost:8080/api/v1/recommend/irrigation
//   ↓ Backend validates JWT
//   ↓ Backend calls Python AI module: POST http://localhost:5000/predict/irrigation
//   ↓ Returns irrigation advisory
//
// REQUEST BODY:
//   { cropName, soilMoisture, temperature, growthStage }
//
// RESPONSE:
//   { waterRequirement, frequency, method, tips }
//
export const getIrrigationAdvisory = async (irrigData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/recommend/irrigation`,
      irrigData,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Irrigation advisory failed.";
    return { success: false, message };
  }
};

// ── getRecommendationHistory() ───────────────────────────────
// Called by: Dashboard.jsx on page load to show history table
//
// 🔗 API CALL: GET http://localhost:8080/api/v1/recommend/history/{userId}
//   ↓ Backend validates JWT
//   ↓ Backend queries MySQL: SELECT * FROM recommendations WHERE user_id = ?
//   ↓ Returns array of past recommendations
//
// RESPONSE:
//   [ { id, type, result, confidence, createdAt }, ... ]
//
export const getRecommendationHistory = async (userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recommend/history/${userId}`,
      getAuthHeaders()
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data?.message || "Failed to fetch history.";
    return { success: false, message };
  }
};