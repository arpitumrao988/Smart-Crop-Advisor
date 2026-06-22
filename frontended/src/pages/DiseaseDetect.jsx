<<<<<<< HEAD
import React, { useState } from "react";

function DiseaseDetect() {
  const [formData, setFormData] = useState({
    cropName: "",
    symptoms: "",
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
    // POST /api/v1/disease/detect

    setResult({
      disease: "Leaf Blight",
      description:
        "A common crop disease that causes yellowing and drying of leaves.",
      treatment:
        "Apply recommended fungicide and remove infected plant parts.",
      prevention:
        "Maintain field hygiene and avoid excessive moisture.",
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
          Disease Detection
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter crop information and symptoms to identify possible diseases.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="cropName"
            placeholder="Crop Name"
            value={formData.cropName}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="symptoms"
            placeholder="Describe Symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows="5"
            style={{
              ...inputStyle,
              resize: "none",
              marginTop: "15px",
            }}
          />

          <button
            type="submit"
            style={{
              marginTop: "20px",
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
            Detect Disease
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
              Disease: {result.disease}
            </h2>

            <p>
              <strong>Description:</strong> {result.description}
            </p>

            <p>
              <strong>Treatment:</strong> {result.treatment}
            </p>

            <p>
              <strong>Prevention:</strong> {result.prevention}
            </p>
          </div>
        )}
=======
// ============================================================
// DiseaseDetect.jsx — Crop Disease Detection Page
//
// 🔗 API CONNECTIONS:
//   GET  /api/v1/disease/list    → getDiseaseList()     — on page load
//   POST /api/v1/disease/detect  → detectDisease()      — on form submit
//
// FLOW:
//   1. Page loads → fetches supported disease list for reference
//   2. User selects crop name from dropdown
//   3. User enters or selects symptoms
//   4. Submit → POST to /disease/detect with cropName + symptoms
//   5. Backend calls Python AI → AI predicts disease
//   6. Backend fetches disease details from DB and returns full info
//   7. Result shown in RecommendationCard
// ============================================================

import React, { useState, useEffect } from "react";
import { detectDisease, getDiseaseList } from "../services/diseaseService";
import RecommendationCard from "../components/RecommendationCard";
import AlertBanner        from "../components/AlertBanner";
import Loader             from "../components/Loader";
import "./RecommendPages.css";
import "./DiseaseDetect.css";

// In every page file add:
// import { useLanguage } from "../context/LanguageContext";

// Inside component add:
// const { t } = useLanguage();

// Then replace every hardcoded string:
// "Welcome back,"      → t("dash_welcome")
// "Total Advisories"   → t("dash_totalAdvisories")
// etc.

// Common symptoms for checkbox selection
const COMMON_SYMPTOMS = [
  "Yellow leaves",
  "Brown spots on leaves",
  "Wilting stems",
  "White powder on leaves",
  "Black lesions",
  "Stunted growth",
  "Root rot",
  "Leaf curl",
  "Fruit discoloration",
  "Premature fruit drop",
  "Water-soaked patches",
  "Rusty orange pustules",
];

const CROP_OPTIONS = [
  "Rice", "Wheat", "Maize", "Tomato", "Potato", "Cotton",
  "Sugarcane", "Groundnut", "Soybean", "Mango", "Banana", "Grapes",
];

function DiseaseDetect() {
  // ── Form State ───────────────────────────────────────────
  const [cropName,         setCropName]         = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);  // Array of checked symptoms
  const [customSymptom,    setCustomSymptom]    = useState("");   // Free-text extra symptom

  // ── UI State ─────────────────────────────────────────────
  const [loading,    setLoading]    = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [result,     setResult]     = useState(null);
  const [diseaseList, setDiseaseList] = useState([]);  // From GET /disease/list
  const [error,      setError]      = useState("");

  // ── useEffect — Load disease list on mount ────────────────
  useEffect(() => {
    const loadDiseaseList = async () => {
      // ─────────────────────────────────────────────────────
      // 🔗 API CALL — GET /api/v1/disease/list
      //    Sent to: http://localhost:8080/api/v1/disease/list
      //    Auth:    Bearer token
      //    Returns: [ { id, cropName, diseaseName }, ... ]
      //
      //    Used to show reference info about supported diseases
      // ─────────────────────────────────────────────────────
      const res = await getDiseaseList();
      setListLoading(false);
      if (res.success) {
        setDiseaseList(res.data);
      }
    };
    loadDiseaseList();
  }, []);

  // ── toggleSymptom() ──────────────────────────────────────
  // Add or remove a symptom from the selected array
  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)   // Uncheck → remove
        : [...prev, symptom]                // Check → add
    );
    setError("");
  };

  // ── handleSubmit() ───────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cropName) {
      setError("Please select your crop first.");
      return;
    }

    // Combine checkbox symptoms with custom text symptom
    const allSymptoms = [...selectedSymptoms];
    if (customSymptom.trim()) {
      allSymptoms.push(customSymptom.trim());
    }

    if (allSymptoms.length === 0) {
      setError("Please select or describe at least one symptom.");
      return;
    }

    setLoading(true);
    setResult(null);

    // ─────────────────────────────────────────────────────────
    // 🔗 API CALL — POST /api/v1/disease/detect
    //    Sent to: http://localhost:8080/api/v1/disease/detect
    //    Auth:    Bearer token
    //    Body:    {
    //               cropName: "Tomato",
    //               symptoms: ["Yellow leaves", "Brown spots on leaves"]
    //             }
    //
    //    Backend Flow:
    //      1. Validates JWT
    //      2. Calls Python AI: POST localhost:5000/predict/disease
    //      3. AI model predicts disease name
    //      4. Backend looks up disease_info table in MySQL for full details
    //      5. Saves detection record to recommendations table
    //      6. Returns full disease info
    //
    //    Returns: {
    //      disease:     "Early Blight",
    //      description: "A fungal disease caused by Alternaria solani...",
    //      severity:    "Medium",
    //      treatment:   "Apply Mancozeb or Chlorothalonil fungicide...",
    //      prevention:  "Rotate crops, avoid overhead irrigation...",
    //      savedAt:     "..."
    //    }
    // ─────────────────────────────────────────────────────────
    const res = await detectDisease(cropName, allSymptoms);

    setLoading(false);

    if (res.success) {
      setResult(res.data);
    } else {
      setError(res.message);
    }
  };

  const handleReset = () => {
    setCropName("");
    setSelectedSymptoms([]);
    setCustomSymptom("");
    setResult(null);
    setError("");
  };

  return (
    <div className="page-wrapper">
      <div className="container recommend-container">

        <div className="recommend-header">
          <h1 className="recommend-title">🦠 Disease Detection</h1>
          <p className="recommend-subtitle">
            Select your crop and describe the symptoms you're observing.
            Our AI will identify the likely disease and suggest treatment.
          </p>
        </div>

        <div className="recommend-layout">

          {/* ── Left: Form ─────────────────────────────────── */}
          <div className="recommend-form-section">
            <div className="card">
              <h2 className="form-section-title">📋 Describe the Problem</h2>

              {error && (
                <AlertBanner type="error" message={error} onClose={() => setError("")} />
              )}

              <form onSubmit={handleSubmit} noValidate>

                {/* Crop Selection */}
                <div className="form-group">
                  <label className="form-label" htmlFor="cropName">Affected Crop</label>
                  <select
                    id="cropName" className="form-input"
                    value={cropName}
                    onChange={e => { setCropName(e.target.value); setError(""); }}
                    disabled={loading}
                  >
                    <option value="">-- Select affected crop --</option>
                    {CROP_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Symptom Checkboxes */}
                <div className="form-group">
                  <label className="form-label">Observed Symptoms</label>
                  <p className="field-tip">Select all symptoms you can see on the plant:</p>
                  <div className="symptoms-grid">
                    {COMMON_SYMPTOMS.map(symptom => (
                      <label key={symptom} className="symptom-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.includes(symptom)}
                          onChange={() => toggleSymptom(symptom)}
                          disabled={loading}
                        />
                        <span className="symptom-label">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Custom Symptom Text Input */}
                <div className="form-group">
                  <label className="form-label" htmlFor="customSymptom">
                    Additional Symptom Description (Optional)
                  </label>
                  <input
                    id="customSymptom"
                    type="text"
                    className="form-input"
                    placeholder="e.g. leaves turning brittle and falling early"
                    value={customSymptom}
                    onChange={e => setCustomSymptom(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Selected symptoms count */}
                {selectedSymptoms.length > 0 && (
                  <p className="selected-count">
                    ✅ {selectedSymptoms.length} symptom(s) selected
                  </p>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? <><span className="btn-spinner" /> Detecting...</> : "🔬 Detect Disease"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
                    🔄 Reset
                  </button>
                </div>
              </form>
            </div>

            {/* 
                Supported Diseases reference list
                Data from GET /api/v1/disease/list 
            */}
            {!listLoading && diseaseList.length > 0 && (
              <div className="card disease-list-card">
                <h3 className="disease-list-title">📋 Supported Diseases</h3>
                <p className="text-muted mb-8">Our system can identify these diseases:</p>
                <div className="disease-tags">
                  {diseaseList.slice(0, 12).map(d => (
                    <span key={d.id} className="disease-tag">
                      {d.diseaseName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Result ──────────────────────────────── */}
          <div className="recommend-result-section">
            {loading && <Loader message="AI is analyzing symptoms..." />}

            {/* 
                🔗 Result from POST /api/v1/disease/detect
                Passed to RecommendationCard for display
            */}
            {!loading && result && (
              <>
                <AlertBanner type="success" message="Disease detected. Result saved to history." />
                <RecommendationCard type="disease" data={result} />
              </>
            )}

            {!loading && !result && (
              <div className="result-placeholder">
                <span className="placeholder-icon">🦠</span>
                <h3>Disease detection result will appear here</h3>
                <p>Select your crop and at least one symptom to proceed</p>
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

export default DiseaseDetect;
=======
export default DiseaseDetect;
>>>>>>> d11086cb83807ad3d6a3645ab661755b31e39763
