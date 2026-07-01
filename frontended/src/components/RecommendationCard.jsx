// ============================================================
// RecommendationCard.jsx — Displays AI Prediction Results
//
// Used by: CropRecommend, FertilizerRecommend,
//          IrrigationAdvisory, DiseaseDetect pages
//
// Props:
//   type        — "crop" | "fertilizer" | "irrigation" | "disease"
//   data        — The recommendation object from the API response
//   onSave      — Optional: called when user clicks "Save" button
//
// NO API CALLS in this component
// ============================================================

import React from "react";
import "./RecommendationCard.css";

function RecommendationCard({ type, data }) {

  // Map type to display label and color
  const typeConfig = {
    crop:        { label: "Crop Recommendation",        icon: "🌾", color: "green"  },
    fertilizer:  { label: "Fertilizer Recommendation",  icon: "💊", color: "blue"   },
    irrigation:  { label: "Irrigation Advisory",        icon: "💧", color: "cyan"   },
    disease:     { label: "Disease Detection Result",   icon: "🦠", color: "orange" },
  };

  const config = typeConfig[type] || typeConfig.crop;

  // Helper: color class for confidence badge
  const getConfidenceClass = (score) => {
    if (score >= 85) return "badge-green";
    if (score >= 65) return "badge-yellow";
    return "badge-red";
  };

  if (!data) return null;

  return (
    <div className={`rec-card rec-card-${config.color}`}>

      {/* ── Card Header ────────────────────────────────────── */}
      <div className="rec-card-header">
        <span className="rec-card-icon">{config.icon}</span>
        <div>
          <p className="rec-card-type">{config.label}</p>
          {/* Show timestamp if available */}
          {data.savedAt && (
            <p className="rec-card-time">
              {new Date(data.savedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* ── Main Result ────────────────────────────────────── */}
      <div className="rec-card-result">
        {/* Different layout based on recommendation type */}

        {type === "crop" && (
          <>
            <h2 className="rec-main-value">{data.recommendedCrop}</h2>
            {data.confidence && (
              <span className={`badge ${getConfidenceClass(data.confidence)}`}>
                {data.confidence}% Confidence
              </span>
            )}
            {data.alternatives && data.alternatives.length > 0 && (
              <div className="rec-alternatives">
                <p className="alt-label">Alternatives:</p>
                <div className="alt-tags">
                  {data.alternatives.map((alt, idx) => (
                    <span key={idx} className="alt-tag">{alt}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {type === "fertilizer" && (
          <>
            <h2 className="rec-main-value">{data.fertilizer}</h2>
            {data.quantity && (
              <p className="rec-sub-value">Quantity: {data.quantity}</p>
            )}
          </>
        )}

        {type === "irrigation" && (
          <>
            <h2 className="rec-main-value">{data.waterRequirement}</h2>
            <p className="rec-sub-value">Frequency: {data.frequency}</p>
            {data.method && (
              <p className="rec-sub-value">Method: {data.method}</p>
            )}
          </>
        )}

        {type === "disease" && (
          <>
            <h2 className="rec-main-value">{data.disease}</h2>
            {data.severity && (
              <span className={`badge ${
                data.severity === "High" ? "badge-red" :
                data.severity === "Medium" ? "badge-yellow" : "badge-green"
              }`}>
                {data.severity} Severity
              </span>
            )}
          </>
        )}
      </div>

      {/* ── Advisory Note ──────────────────────────────────── */}
      {(data.advisoryNote || data.guidance || data.tips || data.treatment) && (
        <div className="rec-card-note">
          <p className="note-title">📋 Advisory Note</p>
          <p className="note-text">
            {data.advisoryNote || data.guidance || data.tips || data.treatment}
          </p>
        </div>
      )}

      {/* ── Prevention (Disease only) ──────────────────────── */}
      {type === "disease" && data.prevention && (
        <div className="rec-card-note rec-card-prevention">
          <p className="note-title">🛡️ Prevention</p>
          <p className="note-text">{data.prevention}</p>
        </div>
      )}

    </div>
  );
}

export default RecommendationCard;