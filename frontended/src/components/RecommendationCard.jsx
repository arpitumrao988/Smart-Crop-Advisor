import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { translateTerm, translateSentence } from "../translations/translations";
import "./RecommendationCard.css";

function RecommendationCard({ type, data }) {
  const { language } = useLanguage();

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
          <p className="rec-card-type">
            {language === "hi" 
              ? (type === "crop" ? "फसल अनुशंसा" : 
                 type === "fertilizer" ? "उर्वरक सलाह" : 
                 type === "irrigation" ? "सिंचाई मार्गदर्शन" : "रोग पहचान परिणाम")
              : config.label
            }
          </p>
          {/* Show timestamp if available */}
          {data.savedAt && (
            <p className="rec-card-time">
              {new Date(data.savedAt).toLocaleString(language === "hi" ? "hi-IN" : "en-US")}
            </p>
          )}
        </div>
      </div>

      {/* ── Main Result ────────────────────────────────────── */}
      <div className="rec-card-result">
        {/* Different layout based on recommendation type */}

        {type === "crop" && (
          <>
            <h2 className="rec-main-value">{translateTerm(data.recommendedCrop, language)}</h2>
            {data.confidence && (
              <span className={`badge ${getConfidenceClass(data.confidence)}`}>
                {data.confidence}% {language === "hi" ? "विश्वास (Confidence)" : "Confidence"}
              </span>
            )}
            {data.alternatives && data.alternatives.length > 0 && (
              <div className="rec-alternatives">
                <p className="alt-label">{language === "hi" ? "वैकल्पिक फसलें:" : "Alternatives:"}</p>
                <div className="alt-tags">
                  {data.alternatives.map((alt, idx) => (
                    <span key={idx} className="alt-tag">{translateTerm(alt, language)}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {type === "fertilizer" && (
          <>
            <h2 className="rec-main-value">{translateTerm(data.fertilizer, language)}</h2>
            {data.quantity && (
              <p className="rec-sub-value">
                {language === "hi" ? "आवश्यक मात्रा:" : "Quantity:"} {translateTerm(data.quantity, language)}
              </p>
            )}
          </>
        )}

        {type === "irrigation" && (
          <>
            <h2 className="rec-main-value">{translateTerm(data.waterRequirement, language)}</h2>
            <p className="rec-sub-value">
              {language === "hi" ? "सिंचाई आवृत्ति:" : "Frequency:"} {translateTerm(data.frequency, language)}
            </p>
            {data.method && (
              <p className="rec-sub-value">
                {language === "hi" ? "सिंचाई विधि:" : "Method:"} {translateTerm(data.method, language)}
              </p>
            )}
          </>
        )}

        {type === "disease" && (
          <>
            <h2 className="rec-main-value">{translateTerm(data.disease, language)}</h2>
            {data.severity && (
              <span className={`badge ${
                data.severity === "High" ? "badge-red" :
                data.severity === "Medium" ? "badge-yellow" : "badge-green"
              }`}>
                {language === "hi" 
                  ? (data.severity === "High" ? "उच्च" : data.severity === "Medium" ? "मध्यम" : "कम") 
                  : data.severity
                } {language === "hi" ? "तीव्रता (Severity)" : "Severity"}
              </span>
            )}
          </>
        )}
      </div>

      {/* ── Advisory Note ──────────────────────────────────── */}
      {(data.advisoryNote || data.guidance || data.tips || data.treatment) && (
        <div className="rec-card-note">
          <p className="note-title">📋 {language === "hi" ? "सुझाव विवरण (Advisory Note)" : "Advisory Note"}</p>
          <p className="note-text">
            {translateSentence(data.advisoryNote || data.guidance || data.tips || data.treatment, language)}
          </p>
        </div>
      )}

      {/* ── Prevention (Disease only) ──────────────────────── */}
      {type === "disease" && data.prevention && (
        <div className="rec-card-note rec-card-prevention">
          <p className="note-title">🛡️ {language === "hi" ? "बचाव व रोकथाम (Prevention)" : "Prevention"}</p>
          <p className="note-text">{translateSentence(data.prevention, language)}</p>
        </div>
      )}

    </div>
  );
}

export default RecommendationCard;