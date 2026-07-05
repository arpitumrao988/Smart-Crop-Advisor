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
import { useLanguage } from "../context/LanguageContext";
import { translateTerm } from "../translations/translations";
import RecommendationCard from "../components/RecommendationCard";
import AlertBanner        from "../components/AlertBanner";
import Loader             from "../components/Loader";
import "./RecommendPages.css";

const CROP_OPTIONS = [
  "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Tomato",
  "Potato", "Onion", "Soybean", "Groundnut",
];

const GROWTH_STAGES = [
  "Germination", "Seedling", "Vegetative", "Flowering", "Fruiting", "Maturity",
];

function IrrigationAdvisory() {
  const { language } = useLanguage();

  const GROWTH_STAGES_MAP = {
    Germination: "अंकुरण (Germination)",
    Seedling: "अंकुर/पौधा (Seedling)",
    Vegetative: "वानस्पतिक (Vegetative)",
    Flowering: "पुष्पन (Flowering)",
    Fruiting: "फलने (Fruiting)",
    Maturity: "परिपक्वता (Maturity)"
  };

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
      setError(language === "hi" ? "कृपया सभी फ़ील्ड भरें।" : "Please fill in all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      cropName:     formData.cropName,
      soilMoisture: parseFloat(formData.soilMoisture),
      temperature:  parseFloat(formData.temperature),
      growthStage:  formData.growthStage,
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
          <h1 className="recommend-title">
            {language === "hi" ? "💧 सिंचाई मार्गदर्शन" : "💧 Irrigation Advisory"}
          </h1>
          <p className="recommend-subtitle">
            {language === "hi"
              ? "हमें अपनी फसल का प्रकार, मिट्टी की नमी, तापमान और विकास चरण बताएं। हम पानी की इष्टतम आवश्यकता और सिंचाई आवृत्ति की गणना करेंगे।"
              : "Tell us your crop type, soil moisture, temperature, and growth stage. We'll calculate the optimal water requirement and irrigation frequency."
            }
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Form ───────────────────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">
                {language === "hi" ? "📋 खेत की परिस्थितियाँ" : "📋 Field Conditions"}
              </h2>

              {error && (
                <AlertBanner type="error" message={error} onClose={() => setError("")} />
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Crop Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="cropName">
                    {language === "hi" ? "फसल का नाम" : "Crop Name"}
                  </label>
                  <select
                    id="cropName" name="cropName" className="form-input"
                    value={formData.cropName} onChange={handleChange} disabled={loading}
                  >
                    <option value="">{language === "hi" ? "-- फसल का चयन करें --" : "-- Select crop --"}</option>
                    {CROP_OPTIONS.map(c => (
                      <option key={c} value={c}>{translateTerm(c, language)}</option>
                    ))}
                  </select>
                </div>

                {/* Growth Stage Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="growthStage">
                    {language === "hi" ? "विकास चरण" : "Growth Stage"}
                  </label>
                  <select
                    id="growthStage" name="growthStage" className="form-input"
                    value={formData.growthStage} onChange={handleChange} disabled={loading}
                  >
                    <option value="">{language === "hi" ? "-- विकास चरण चुनें --" : "-- Select growth stage --"}</option>
                    {GROWTH_STAGES.map(g => (
                      <option key={g} value={g}>
                        {language === "hi" ? (GROWTH_STAGES_MAP[g] || g) : g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="fields-grid">
                  {/* Soil Moisture */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="soilMoisture">
                      {language === "hi" ? "मिट्टी की नमी" : "Soil Moisture"} <span className="field-unit">%</span>
                    </label>
                    <input
                      id="soilMoisture" name="soilMoisture" type="number" step="any"
                      className="form-input" 
                      placeholder={language === "hi" ? "सीमा: 0 - 100" : "Range: 0 - 100"}
                      value={formData.soilMoisture} onChange={handleChange}
                      min={0} max={100} disabled={loading}
                    />
                    <p className="field-tip">
                      {language === "hi" ? "आपकी मिट्टी का वर्तमान नमी स्तर (0-100%)" : "Current moisture level of your soil (0–100%)"}
                    </p>
                  </div>

                  {/* Temperature */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="temperature">
                      {language === "hi" ? "तापमान" : "Temperature"} <span className="field-unit">°C</span>
                    </label>
                    <input
                      id="temperature" name="temperature" type="number" step="any"
                      className="form-input" 
                      placeholder={language === "hi" ? "सीमा: 5 - 50" : "Range: 5 - 50"}
                      value={formData.temperature} onChange={handleChange}
                      min={5} max={50} disabled={loading}
                    />
                    <p className="field-tip">
                      {language === "hi" ? "आपके खेत में दिन का वर्तमान तापमान" : "Current daytime temperature in your field"}
                    </p>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                      <><span className="btn-spinner" /> {language === "hi" ? "गणना की जा रही है..." : "Calculating..."}</>
                    ) : (
                      language === "hi" ? "💧 सिंचाई योजना प्राप्त करें" : "💧 Get Irrigation Plan"
                    )}
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
                    {language === "hi" ? "🔄 रीसेट" : "🔄 Reset"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Result ─────────────────────────────────────── */}
          <div className="recommend-result-section">
            {loading && <Loader message={language === "hi" ? "सिंचाई मार्गदर्शन की गणना की जा रही है..." : "Calculating irrigation advisory..."} />}

            {!loading && result && (
              <>
                <AlertBanner type="success" message={language === "hi" ? "सिंचाई मार्गदर्शन सफलतापूर्वक उत्पन्न किया गया!" : "Irrigation advisory generated!"} />
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