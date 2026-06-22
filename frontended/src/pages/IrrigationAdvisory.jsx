<<<<<<< HEAD
import React, { useState } from "react";

function IrrigationAdvisory() {
  const [formData, setFormData] = useState({
    cropType: "",
    soilMoisture: "",
    temperature: "",
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
    // POST /api/v1/recommend/irrigation

    setResult({
      waterRequirement: "1200 Liters / Day",
      frequency: "Every 2 Days",
      note:
        "Maintain adequate soil moisture and avoid excessive irrigation.",
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
          maxWidth: "850px",
          margin: "auto",
          background: "#ffffff",
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
          Irrigation Advisory
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter crop and environmental information to receive irrigation
          guidance.
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
              type="text"
              name="cropType"
              placeholder="Crop Type"
              value={formData.cropType}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="soilMoisture"
              placeholder="Soil Moisture (%)"
              value={formData.soilMoisture}
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
            Get Irrigation Advice
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
              Irrigation Recommendation
            </h2>

            <p>
              <strong>Water Requirement:</strong>{" "}
              {result.waterRequirement}
            </p>

            <p>
              <strong>Frequency:</strong> {result.frequency}
            </p>

            <p>
              <strong>Advisory Note:</strong> {result.note}
            </p>
          </div>
        )}
=======
// ============================================================
// IrrigationAdvisory.jsx — Irrigation Guidance Page
//
// 🔗 API CONNECTION:
//   POST /api/v1/recommend/irrigation
//   (via recommendService.getIrrigationAdvisory())
//
// REQUEST BODY:
//   { cropName, soilMoisture, temperature, growthStage }
//
// RESPONSE:
//   { waterRequirement, frequency, method, tips }
// ============================================================

import React, { useState } from "react";
import { getIrrigationAdvisory } from "../services/recommendService";
import RecommendationCard from "../components/RecommendationCard";
import AlertBanner        from "../components/AlertBanner";
import Loader             from "../components/Loader";
import "./RecommendPages.css";
// In every page file add:
// import { useLanguage } from "../context/LanguageContext";

// Inside component add:
// const { t } = useLanguage();

// Then replace every hardcoded string:
// "Welcome back,"      → t("dash_welcome")
// "Total Advisories"   → t("dash_totalAdvisories")
// etc.

const CROP_OPTIONS = [
  "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Tomato",
  "Potato", "Onion", "Soybean", "Groundnut",
];

const GROWTH_STAGES = [
  "Germination", "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity",
];

function IrrigationAdvisory() {
  // ── Form State ───────────────────────────────────────────
  const [formData, setFormData] = useState({
    cropName:    "",
    soilMoisture: "",
    temperature:  "",
    growthStage:  "",
  });

  // ── UI State ─────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cropName || !formData.soilMoisture ||
        !formData.temperature || !formData.growthStage) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      cropName:     formData.cropName,
      growthStage:  formData.growthStage,
      soilMoisture: parseFloat(formData.soilMoisture),
      temperature:  parseFloat(formData.temperature),
    };

    // ─────────────────────────────────────────────────────────
    // 🔗 API CALL — POST /api/v1/recommend/irrigation
    //    Sent to: http://localhost:8080/api/v1/recommend/irrigation
    //    Auth:    Bearer token
    //    Body:    { cropName, soilMoisture, temperature, growthStage }
    //
    //    Backend calls: POST localhost:5000/predict/irrigation
    //    Returns: {
    //      waterRequirement: "8–10 liters/day per plant",
    //      frequency: "Every 2 days",
    //      method: "Drip Irrigation",
    //      tips: "Irrigate in early morning to reduce evaporation...",
    //      savedAt: "..."
    //    }
    // ─────────────────────────────────────────────────────────
    const res = await getIrrigationAdvisory(payload);

    setLoading(false);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message);
    }
  };

  const handleReset = () => {
    setFormData({ cropName: "", soilMoisture: "", temperature: "", growthStage: "" });
    setResult(null);
    setError("");
  };

  return (
    <div className="page-wrapper">
      <div className="container recommend-container">

        <div className="recommend-header">
          <h1 className="recommend-title">💧 Irrigation Advisory</h1>
          <p className="recommend-subtitle">
            Tell us your crop type, soil moisture, temperature, and growth stage.
            We'll calculate the optimal water requirement and irrigation frequency.
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Form ───────────────────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">📋 Field Conditions</h2>

              {error && (
                <AlertBanner type="error" message={error} onClose={() => setError("")} />
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Crop Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="cropName">Crop Name</label>
                  <select
                    id="cropName" name="cropName" className="form-input"
                    value={formData.cropName} onChange={handleChange} disabled={loading}
                  >
                    <option value="">-- Select crop --</option>
                    {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Growth Stage Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="growthStage">Growth Stage</label>
                  <select
                    id="growthStage" name="growthStage" className="form-input"
                    value={formData.growthStage} onChange={handleChange} disabled={loading}
                  >
                    <option value="">-- Select growth stage --</option>
                    {GROWTH_STAGES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="fields-grid">
                  {/* Soil Moisture */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="soilMoisture">
                      Soil Moisture <span className="field-unit">%</span>
                    </label>
                    <input
                      id="soilMoisture" name="soilMoisture" type="number" step="any"
                      className="form-input" placeholder="e.g. 35"
                      value={formData.soilMoisture} onChange={handleChange}
                      min={0} max={100} disabled={loading}
                    />
                    <p className="field-tip">Current moisture level of your soil (0–100%)</p>
                  </div>

                  {/* Temperature */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="temperature">
                      Temperature <span className="field-unit">°C</span>
                    </label>
                    <input
                      id="temperature" name="temperature" type="number" step="any"
                      className="form-input" placeholder="e.g. 30"
                      value={formData.temperature} onChange={handleChange}
                      min={5} max={50} disabled={loading}
                    />
                    <p className="field-tip">Current daytime temperature in your field</p>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="btn-spinner" /> Calculating...</> : "💧 Get Irrigation Plan"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
                    🔄 Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Result ─────────────────────────────────────── */}
          <div className="recommend-result-section">
            {loading && <Loader message="Calculating your irrigation plan..." />}

            {/* 
                🔗 Result from POST /api/v1/recommend/irrigation
                Displayed by RecommendationCard component
            */}
            {!loading && result && (
              <>
                <AlertBanner type="success" message="Irrigation plan generated and saved!" />
                <RecommendationCard type="irrigation" data={result} />
              </>
            )}

            {!loading && !result && (
              <div className="result-placeholder">
                <span className="placeholder-icon">💧</span>
                <h3>Your irrigation plan will appear here</h3>
                <p>Select your crop and enter field conditions to get a plan</p>
              </div>
            )}
          </div>

        </div>
>>>>>>> d11086cb83807ad3d6a3645ab661755b31e39763
      </div>
    </div>
  );
}

<<<<<<< HEAD
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
};

export default IrrigationAdvisory;
=======
export default IrrigationAdvisory;
>>>>>>> d11086cb83807ad3d6a3645ab661755b31e39763
