// ============================================================
// FertilizerRecommend.jsx — Fertilizer Recommendation Page
//
// 🔗 API CONNECTION:
//   POST /api/v1/recommend/fertilizer
//   (via recommendService.getFertilizerRecommendation())
//
// REQUEST BODY:
//   { cropName, soilType, nitrogen, phosphorus, potassium }
//
// RESPONSE:
//   { fertilizer, quantity, guidance, savedAt }
// ============================================================

import React, { useState } from "react";
import { getFertilizerRecommendation } from "../services/recommendService";
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

// Options for dropdown fields
const CROP_OPTIONS = [
  "Rice", "Maize", "Jute", "Cotton", "Coconut", "Papaya", "Orange",
  "Apple", "Muskmelon", "Watermelon", "Grapes", "Mango", "Banana",
  "Pomegranate", "Lentil", "Blackgram", "Mungbean", "Chickpea", "Coffee",
];

const SOIL_TYPES = [
  "Sandy", "Loamy", "Black", "Red", "Clayey", "Sandy Loam",
];

function FertilizerRecommend() {
  // ── Form State ───────────────────────────────────────────
  const [formData, setFormData] = useState({
    cropName:   "",
    soilType:   "",
    nitrogen:   "",
    phosphorus: "",
    potassium:  "",
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

    if (!formData.cropName || !formData.soilType ||
        !formData.nitrogen  || !formData.phosphorus || !formData.potassium) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Build the payload — converting NPK strings to numbers
    const payload = {
      cropName:   formData.cropName,
      soilType:   formData.soilType,
      nitrogen:   parseFloat(formData.nitrogen),
      phosphorus: parseFloat(formData.phosphorus),
      potassium:  parseFloat(formData.potassium),
    };

    // ─────────────────────────────────────────────────────────
    // 🔗 API CALL — POST /api/v1/recommend/fertilizer
    //    Sent to: http://localhost:8080/api/v1/recommend/fertilizer
    //    Auth:    Bearer token
    //    Body:    { cropName, soilType, nitrogen, phosphorus, potassium }
    //
    //    Backend Flow:
    //      1. Validates JWT
    //      2. Calls Python AI: POST localhost:5000/predict/fertilizer
    //      3. Saves result to MySQL
    //      4. Returns recommendation
    //
    //    Returns: {
    //      fertilizer: "Urea",
    //      quantity: "50 kg per acre",
    //      guidance: "Apply in two split doses...",
    //      savedAt: "..."
    //    }
    // ─────────────────────────────────────────────────────────
    const res = await getFertilizerRecommendation(payload);

    setLoading(false);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message);
    }
  };

  const handleReset = () => {
    setFormData({ cropName: "", soilType: "", nitrogen: "", phosphorus: "", potassium: "" });
    setResult(null);
    setError("");
  };

  return (
    <div className="page-wrapper">
      <div className="container recommend-container">

        <div className="recommend-header">
          <h1 className="recommend-title">💊 Fertilizer Recommendation</h1>
          <p className="recommend-subtitle">
            Select your crop and soil type, enter current NPK levels to get
            a personalized fertilizer recommendation.
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Form ───────────────────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">📋 Enter Details</h2>

              {error && (
                <AlertBanner type="error" message={error} onClose={() => setError("")} />
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Crop Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="cropName">Crop Name</label>
                  <select
                    id="cropName"
                    name="cropName"
                    className="form-input"
                    value={formData.cropName}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Select your crop --</option>
                    {CROP_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Soil Type Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="soilType">Soil Type</label>
                  <select
                    id="soilType"
                    name="soilType"
                    className="form-input"
                    value={formData.soilType}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">-- Select soil type --</option>
                    {SOIL_TYPES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* NPK Fields */}
                <div className="fields-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nitrogen">
                      Nitrogen (N) <span className="field-unit">mg/kg</span>
                    </label>
                    <input
                      id="nitrogen" name="nitrogen" type="number" step="any"
                      className="form-input" placeholder="e.g. 90"
                      value={formData.nitrogen} onChange={handleChange} disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phosphorus">
                      Phosphorus (P) <span className="field-unit">mg/kg</span>
                    </label>
                    <input
                      id="phosphorus" name="phosphorus" type="number" step="any"
                      className="form-input" placeholder="e.g. 42"
                      value={formData.phosphorus} onChange={handleChange} disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="potassium">
                      Potassium (K) <span className="field-unit">mg/kg</span>
                    </label>
                    <input
                      id="potassium" name="potassium" type="number" step="any"
                      className="form-input" placeholder="e.g. 43"
                      value={formData.potassium} onChange={handleChange} disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="btn-spinner" /> Analyzing...</> : "💊 Get Fertilizer Advice"}
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
            {loading && <Loader message="Calculating fertilizer recommendation..." />}

            {/* 
                🔗 Result from POST /api/v1/recommend/fertilizer
                Passed to RecommendationCard which renders it as a card
            */}
            {!loading && result && (
              <>
                <AlertBanner type="success" message="Fertilizer recommendation saved!" />
                <RecommendationCard type="fertilizer" data={result} />
              </>
            )}

            {!loading && !result && (
              <div className="result-placeholder">
                <span className="placeholder-icon">💊</span>
                <h3>Your fertilizer advice will appear here</h3>
                <p>Select crop, soil type, and enter NPK values to proceed</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FertilizerRecommend;
