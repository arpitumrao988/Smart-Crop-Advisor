<<<<<<< HEAD
import React, { useState } from "react";

function CropRecommend() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Future API Call
    // POST /api/v1/recommend/crop

    setResult({
      crop: "Rice",
      confidence: "94.7%",
      alternatives: "Maize, Jute",
      note:
        "Soil and climate conditions are suitable for rice cultivation.",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f4",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2e7d32",
          }}
        >
          Crop Recommendation
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter soil and environmental data to get crop recommendations.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "20px",
            }}
          >
            <input
              type="number"
              name="nitrogen"
              placeholder="Nitrogen (N)"
              value={formData.nitrogen}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="phosphorus"
              placeholder="Phosphorus (P)"
              value={formData.phosphorus}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="potassium"
              placeholder="Potassium (K)"
              value={formData.potassium}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="temperature"
              placeholder="Temperature (°C)"
              value={formData.temperature}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="humidity"
              placeholder="Humidity (%)"
              value={formData.humidity}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="ph"
              placeholder="pH Level"
              value={formData.ph}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="rainfall"
              placeholder="Rainfall (mm)"
              value={formData.rainfall}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "25px",
              width: "100%",
              padding: "14px",
              background: "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Get Recommendation
          </button>
        </form>

        {result && (
          <div
            style={{
              marginTop: "30px",
              background: "#f8fff8",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid #d4edda",
            }}
          >
            <h2 style={{ color: "#2e7d32" }}>
              Recommended Crop: {result.crop}
            </h2>

            <p>
              <strong>Confidence:</strong> {result.confidence}
            </p>

            <p>
              <strong>Alternative Crops:</strong>{" "}
              {result.alternatives}
            </p>

            <p>
              <strong>Advisory Note:</strong> {result.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
};

export default CropRecommend;
=======
// ============================================================
// CropRecommend.jsx — Crop Recommendation Page
//
// 🔗 API CONNECTION:
//   POST /api/v1/recommend/crop  (via recommendService.getCropRecommendation())
//   Called when user submits the soil input form
//
// FLOW:
//   1. User fills N, P, K, temperature, humidity, pH, rainfall
//   2. Submit → calls getCropRecommendation(formData)
//   3. Service sends POST to backend with JWT in header
//   4. Backend validates JWT, saves input, calls Python AI
//   5. Python AI predicts crop → backend saves result → returns to frontend
//   6. Frontend shows the result using RecommendationCard
// ============================================================

import React, { useState } from "react";
import { getCropRecommendation } from "../services/recommendService";
import RecommendationCard from "../components/RecommendationCard";
import AlertBanner        from "../components/AlertBanner";
import Loader             from "../components/Loader";
import "./RecommendPages.css";

// Field definitions for the soil input form
// Each field maps to a key in the API request body
const FORM_FIELDS = [
  {
    name: "N", label: "Nitrogen (N)", unit: "mg/kg",
    placeholder: "e.g. 90",
    tip: "Available nitrogen in soil. Ideal: 0–140 mg/kg",
    min: 0, max: 140,
  },
  {
    name: "P", label: "Phosphorus (P)", unit: "mg/kg",
    placeholder: "e.g. 42",
    tip: "Available phosphorus in soil. Ideal: 5–145 mg/kg",
    min: 5, max: 145,
  },
  {
    name: "K", label: "Potassium (K)", unit: "mg/kg",
    placeholder: "e.g. 43",
    tip: "Available potassium in soil. Ideal: 5–205 mg/kg",
    min: 5, max: 205,
  },
  {
    name: "temperature", label: "Temperature", unit: "°C",
    placeholder: "e.g. 25.5",
    tip: "Average local temperature. Ideal: 10–45 °C",
    min: 10, max: 45,
  },
  {
    name: "humidity", label: "Humidity", unit: "%",
    placeholder: "e.g. 80",
    tip: "Relative humidity in the field. Range: 14–100 %",
    min: 14, max: 100,
  },
  {
    name: "ph", label: "Soil pH", unit: "pH",
    placeholder: "e.g. 6.5",
    tip: "Soil acidity/alkalinity. Neutral is 7. Range: 3.5–10",
    min: 3.5, max: 10,
  },
  {
    name: "rainfall", label: "Rainfall", unit: "mm",
    placeholder: "e.g. 202.9",
    tip: "Annual or seasonal rainfall. Range: 20–300 mm",
    min: 20, max: 300,
  },
];

function CropRecommend() {
  // ── Form State ───────────────────────────────────────────
  // Starts with all fields empty string
  const initialForm = FORM_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
  const [formData, setFormData] = useState(initialForm);

  // ── UI State ─────────────────────────────────────────────
  const [loading,    setLoading]    = useState(false); // API call in progress
  const [result,     setResult]     = useState(null);  // Recommendation result from backend
  const [error,      setError]      = useState("");    // Error message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts editing
  };

  // ── handleSubmit() ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation: all fields must have a value
    const hasEmpty = FORM_FIELDS.some((f) => formData[f.name] === "");
    if (hasEmpty) {
      setError("Please fill in all the fields before submitting.");
      return;
    }

    setLoading(true);
    setResult(null);  // Clear previous result

    // Convert all string values to numbers for the API
    const numericData = {};
    FORM_FIELDS.forEach((f) => {
      numericData[f.name] = parseFloat(formData[f.name]);
    });

    // ─────────────────────────────────────────────────────────
    // 🔗 API CALL — POST /api/v1/recommend/crop
    //    Sent to: http://localhost:8080/api/v1/recommend/crop
    //    Auth:    Bearer token (added automatically by service)
    //    Body:    { N: 90, P: 42, K: 43, temperature: 25.5,
    //               humidity: 80, ph: 6.5, rainfall: 202.9 }
    //
    //    Backend Flow:
    //      1. Spring Security validates JWT token
    //      2. RecommendService saves soil input to MySQL
    //      3. Backend calls Python AI: POST localhost:5000/predict/crop
    //      4. Python runs Random Forest model → returns prediction
    //      5. Backend saves recommendation to MySQL
    //      6. Returns result to frontend
    //
    //    Returns: {
    //      recommendedCrop: "Rice",
    //      confidence: 94.7,
    //      alternatives: ["Maize", "Jute"],
    //      advisoryNote: "Your soil conditions are suitable for Rice...",
    //      savedAt: "2025-06-08T10:30:00Z"
    //    }
    // ─────────────────────────────────────────────────────────
    const res = await getCropRecommendation(numericData);

    setLoading(false);

    if (res.success) {
      setResult(res.data); // Store result → triggers RecommendationCard render
    } else {
      setError(res.message);
    }
  };

  // ── Reset form and result ─────────────────────────────────
  const handleReset = () => {
    setFormData(initialForm);
    setResult(null);
    setError("");
  };

  return (
    <div className="page-wrapper">
      <div className="container recommend-container">

        {/* ── Page Header ────────────────────────────────── */}
        <div className="recommend-header">
          <h1 className="recommend-title">🌾 Crop Recommendation</h1>
          <p className="recommend-subtitle">
            Enter your soil and climate data below. Our AI model will recommend
            the best crop to grow based on your exact field conditions.
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Left: Input Form ───────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">📋 Enter Field Data</h2>
              <p className="form-section-subtitle">
                All values must reflect your current field conditions.
              </p>

              {/* Error Alert */}
              {error && (
                <AlertBanner
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Dynamically render all 7 input fields from FORM_FIELDS array */}
                <div className="fields-grid">
                  {FORM_FIELDS.map((field) => (
                    <div key={field.name} className="form-group">
                      <label className="form-label" htmlFor={field.name}>
                        {field.label}
                        <span className="field-unit">{field.unit}</span>
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        type="number"
                        step="any"
                        className="form-input"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        disabled={loading}
                      />
                      {/* Tooltip with acceptable range */}
                      <p className="field-tip">{field.tip}</p>
                    </div>
                  ))}
                </div>

                {/* Form Action Buttons */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="btn-spinner" /> Analyzing...</>
                    ) : (
                      "🤖 Get Recommendation"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    🔄 Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Right: Result Section ──────────────────────── */}
          <div className="recommend-result-section">

            {/* Loading spinner while waiting for API */}
            {loading && (
              <Loader message="AI is analyzing your field data..." />
            )}

            {/* 
                Show result card when API returns successfully
                RecommendationCard receives the full API response
                and renders it in a formatted card
            */}
            {!loading && result && (
              <>
                <AlertBanner
                  type="success"
                  message="Recommendation generated and saved to your history!"
                />
                <RecommendationCard type="crop" data={result} />
              </>
            )}

            {/* Placeholder shown when no result yet and not loading */}
            {!loading && !result && (
              <div className="result-placeholder">
                <span className="placeholder-icon">🌾</span>
                <h3>Your recommendation will appear here</h3>
                <p>Fill in the form on the left and click "Get Recommendation"</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CropRecommend;
>>>>>>> d11086cb83807ad3d6a3645ab661755b31e39763
