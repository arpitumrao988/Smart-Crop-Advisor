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
      </div>
    </div>
  );
}

export default IrrigationAdvisory;
