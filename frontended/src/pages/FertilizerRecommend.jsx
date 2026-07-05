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
import { useLanguage } from "../context/LanguageContext";
import { translateTerm } from "../translations/translations";
import RecommendationCard from "../components/RecommendationCard";
import AlertBanner        from "../components/AlertBanner";
import Loader             from "../components/Loader";
import "./RecommendPages.css";

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
  const { language } = useLanguage();

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
      setError(language === "hi" ? "कृपया सभी फ़ील्ड भरें।" : "Please fill in all fields.");
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
          <h1 className="recommend-title">
            {language === "hi" ? "💊 उर्वरक सलाह" : "💊 Fertilizer Recommendation"}
          </h1>
          <p className="recommend-subtitle">
            {language === "hi"
              ? "अपनी फसल और मिट्टी का प्रकार चुनें, और व्यक्तिगत उर्वरक सलाह प्राप्त करने के लिए वर्तमान NPK स्तर दर्ज करें।"
              : "Select your crop and soil type, enter current NPK levels to get a personalized fertilizer recommendation."
            }
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Form ───────────────────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">
                {language === "hi" ? "📋 विवरण दर्ज करें" : "📋 Enter Details"}
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
                    id="cropName"
                    name="cropName"
                    className="form-input"
                    value={formData.cropName}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">{language === "hi" ? "-- फसल का चयन करें --" : "-- Select your crop --"}</option>
                    {CROP_OPTIONS.map(c => (
                      <option key={c} value={c}>{translateTerm(c, language)}</option>
                    ))}
                  </select>
                </div>

                {/* Soil Type Dropdown */}
                <div className="form-group">
                  <label className="form-label" htmlFor="soilType">
                    {language === "hi" ? "मिट्टी का प्रकार" : "Soil Type"}
                  </label>
                  <select
                    id="soilType"
                    name="soilType"
                    className="form-input"
                    value={formData.soilType}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">{language === "hi" ? "-- मिट्टी का चयन करें --" : "-- Select soil type --"}</option>
                    {SOIL_TYPES.map(s => (
                      <option key={s} value={s}>{translateTerm(s, language)}</option>
                    ))}
                  </select>
                </div>

                {/* NPK Fields */}
                <div className="fields-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nitrogen">
                      {language === "hi" ? "नाइट्रोजन (N)" : "Nitrogen (N)"} <span className="field-unit">mg/kg</span>
                    </label>
                    <input
                      id="nitrogen" name="nitrogen" type="number" step="any"
                      className="form-input" 
                      placeholder={language === "hi" ? "सीमा: 0 - 140" : "Range: 0 - 140"}
                      value={formData.nitrogen} onChange={handleChange} disabled={loading}
                    />
                    <p className="field-tip">
                      {language === "hi" ? "मिट्टी में उपलब्ध नाइट्रोजन। आदर्श: 0-140 mg/kg" : "Available nitrogen in soil. Ideal: 0–140 mg/kg"}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phosphorus">
                      {language === "hi" ? "फास्फोरस (P)" : "Phosphorus (P)"} <span className="field-unit">mg/kg</span>
                    </label>
                    <input
                      id="phosphorus" name="phosphorus" type="number" step="any"
                      className="form-input" 
                      placeholder={language === "hi" ? "सीमा: 5 - 145" : "Range: 5 - 145"}
                      value={formData.phosphorus} onChange={handleChange} disabled={loading}
                    />
                    <p className="field-tip">
                      {language === "hi" ? "मिट्टी में उपलब्ध फास्फोरस। आदर्श: 5-145 mg/kg" : "Available phosphorus in soil. Ideal: 5–145 mg/kg"}
                    </p>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="potassium">
                      {language === "hi" ? "पोटेशियम (K)" : "Potassium (K)"} <span className="field-unit">mg/kg</span>
                    </label>
                    <input
                      id="potassium" name="potassium" type="number" step="any"
                      className="form-input" 
                      placeholder={language === "hi" ? "सीमा: 5 - 205" : "Range: 5 - 205"}
                      value={formData.potassium} onChange={handleChange} disabled={loading}
                    />
                    <p className="field-tip">
                      {language === "hi" ? "मिट्टी में उपलब्ध पोटेशियम। आदर्श: 5-205 mg/kg" : "Available potassium in soil. Ideal: 5–205 mg/kg"}
                    </p>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                      <><span className="btn-spinner" /> {language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing..."}</>
                    ) : (
                      language === "hi" ? "💊 उर्वरक सलाह प्राप्त करें" : "💊 Get Fertilizer Advice"
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
            {loading && <Loader message={language === "hi" ? "उर्वरक सिफारिश की गणना की जा रही है..." : "Calculating fertilizer recommendation..."} />}

            {!loading && result && (
              <>
                <AlertBanner type="success" message={language === "hi" ? "उर्वरक सलाह सफलतापूर्वक सहेजी गई!" : "Fertilizer recommendation saved!"} />
                <RecommendationCard type="fertilizer" data={result} />
              </>
            )}

            {!loading && !result && (
              <div className="result-placeholder">
                <span className="placeholder-icon">💊</span>
                <h3>{language === "hi" ? "आपकी उर्वरक सलाह यहाँ दिखाई देगी" : "Your fertilizer advice will appear here"}</h3>
                <p>{language === "hi" ? "फसल, मिट्टी का प्रकार चुनें और जारी रखने के लिए NPK मान दर्ज करें" : "Select crop, soil type, and enter NPK values to proceed"}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FertilizerRecommend;