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
import { useLanguage } from "../context/LanguageContext";
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
  const { language } = useLanguage();

  // ── Form State ───────────────────────────────────────────
  const initialForm = FORM_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});
  const [formData, setFormData] = useState(initialForm);

  // ── UI State ─────────────────────────────────────────────
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // ── handleSubmit() ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmpty = FORM_FIELDS.some((f) => formData[f.name] === "");
    if (hasEmpty) {
      setError(language === "hi" 
        ? "कृपया सबमिट करने से पहले सभी फ़ील्ड भरें।" 
        : "Please fill in all the fields before submitting."
      );
      return;
    }

    setLoading(true);
    setResult(null);

    const numericData = {};
    FORM_FIELDS.forEach((f) => {
      numericData[f.name] = parseFloat(formData[f.name]);
    });

    const res = await getCropRecommendation(numericData);
    setLoading(false);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message);
    }
  };

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
          <h1 className="recommend-title">
            {language === "hi" ? "🌾 फसल अनुशंसा" : "🌾 Crop Recommendation"}
          </h1>
          <p className="recommend-subtitle">
            {language === "hi"
              ? "नीचे अपनी मिट्टी और जलवायु का डेटा दर्ज करें। हमारा AI मॉडल आपके खेत की सही परिस्थितियों के आधार पर उगाने के लिए सबसे अच्छी फसल की सिफारिश करेगा।"
              : "Enter your soil and climate data below. Our AI model will recommend the best crop to grow based on your exact field conditions."
            }
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Left: Input Form ───────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">
                {language === "hi" ? "📋 खेत का डेटा दर्ज करें" : "📋 Enter Field Data"}
              </h2>
              <p className="form-section-subtitle">
                {language === "hi"
                  ? "सभी मान आपकी वर्तमान खेत की स्थिति को दर्शाने चाहिए।"
                  : "All values must reflect your current field conditions."
                }
              </p>

              {error && (
                <AlertBanner
                  type="error"
                  message={error}
                  onClose={() => setError("")}
                />
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="fields-grid">
                  {FORM_FIELDS.map((field) => {
                    const label = language === "hi" 
                      ? (field.name === "N" ? "नाइट्रोजन (N)" :
                         field.name === "P" ? "फास्फोरस (P)" :
                         field.name === "K" ? "पोटेशियम (K)" :
                         field.name === "temperature" ? "तापमान" :
                         field.name === "humidity" ? "आर्द्रता" :
                         field.name === "ph" ? "मिट्टी pH" : "वर्षा")
                      : field.label;

                    const placeholder = language === "hi"
                      ? `सीमा: ${field.min} - ${field.max}`
                      : `Range: ${field.min} - ${field.max}`;

                    const tip = language === "hi"
                      ? (field.name === "N" ? "मिट्टी में उपलब्ध नाइट्रोजन। आदर्श: 0-140 mg/kg" :
                         field.name === "P" ? "मिट्टी में उपलब्ध फास्फोरस। आदर्श: 5-145 mg/kg" :
                         field.name === "K" ? "मिट्टी में उपलब्ध पोटेशियम। आदर्श: 5-205 mg/kg" :
                         field.name === "temperature" ? "औसत स्थानीय तापमान। आदर्श: 10-45 °C" :
                         field.name === "humidity" ? "खेत में सापेक्ष आर्द्रता। सीमा: 14-100 %" :
                         field.name === "ph" ? "मिट्टी की अम्लता/क्षारीयता। सीमा: 3.5-10" : "वार्षिक या मौसमी वर्षा। सीमा: 20-300 mm")
                      : field.tip;

                    return (
                      <div key={field.name} className="form-group">
                        <label className="form-label" htmlFor={field.name}>
                          {label}
                          <span className="field-unit">{field.unit}</span>
                        </label>
                        <input
                          id={field.name}
                          name={field.name}
                          type="number"
                          step="any"
                          className="form-input"
                          placeholder={placeholder}
                          value={formData[field.name]}
                          onChange={handleChange}
                          min={field.min}
                          max={field.max}
                          disabled={loading}
                        />
                        <p className="field-tip">{tip}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="btn-spinner" /> {language === "hi" ? "विश्लेषण हो रहा है..." : "Analyzing..."}</>
                    ) : (
                      language === "hi" ? "🤖 सुझाव प्राप्त करें" : "🤖 Get Recommendation"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    {language === "hi" ? "🔄 रीसेट" : "🔄 Reset"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ── Right: Result Section ──────────────────────── */}
          <div className="recommend-result-section">

            {loading && (
              <Loader message={language === "hi" ? "AI आपके खेत के डेटा का विश्लेषण कर रहा है..." : "AI is analyzing your field data..."} />
            )}

            {!loading && result && (
              <>
                <AlertBanner
                  type="success"
                  message={language === "hi" ? "अनुशंसा सफलतापूर्वक उत्पन्न और इतिहास में सहेजी गई!" : "Recommendation generated and saved to your history!"}
                />
                <RecommendationCard type="crop" data={result} />
              </>
            )}

            {!loading && !result && (
              <div className="result-placeholder">
                <span className="placeholder-icon">🌾</span>
                <h3>{language === "hi" ? "आपकी अनुशंसा यहाँ दिखाई देगी" : "Your recommendation will appear here"}</h3>
                <p>{language === "hi" ? "बाईं ओर फॉर्म भरें और 'सुझाव प्राप्त करें' पर क्लिक करें" : "Fill in the form on the left and click 'Get Recommendation'"}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default CropRecommend;