// ============================================================
// LanguageSelector.jsx — Language Dropdown in Navbar
//
// Shows a dropdown with all 8 supported languages
// When farmer selects a language → entire app switches instantly
// ============================================================

import React, { useState } from "react";
import { useLanguage, translations } from "../context/LanguageContext";
import "./LanguageSelector.css";

// All available languages with their display info
const LANGUAGES = [
  { code: "en", flag: "🇬🇧", name: "English",    native: "English"    },
  { code: "hi", flag: "🇮🇳", name: "Hindi",      native: "हिंदी"      },
  { code: "mr", flag: "🇮🇳", name: "Marathi",    native: "मराठी"      },
  { code: "pa", flag: "🇮🇳", name: "Punjabi",    native: "ਪੰਜਾਬੀ"    },
  { code: "te", flag: "🇮🇳", name: "Telugu",     native: "తెలుగు"     },
  { code: "ta", flag: "🇮🇳", name: "Tamil",      native: "தமிழ்"      },
  { code: "bn", flag: "🇮🇳", name: "Bengali",    native: "বাংলা"      },
  { code: "gu", flag: "🇮🇳", name: "Gujarati",   native: "ગુજરાતી"   },
];

function LanguageSelector() {
  const { language, changeLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  // Find current language object for display
  const current = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const handleSelect = (code) => {
    changeLanguage(code); // Update context + localStorage
    setIsOpen(false);     // Close dropdown
  };

  return (
    <div className="lang-selector">

      {/* ── Trigger Button ─────────────────────────────────── */}
      <button
        className="lang-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        title={t("selectLanguage")}
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-name-short">{current.native}</span>
        <span className="lang-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* ── Dropdown Menu ──────────────────────────────────── */}
      {isOpen && (
        <>
          {/* Invisible overlay to close dropdown when clicking outside */}
          <div
            className="lang-overlay"
            onClick={() => setIsOpen(false)}
          />

          <div className="lang-dropdown">
            <p className="lang-dropdown-title">{t("selectLanguage")}</p>

            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className={`lang-option ${language === lang.code ? "lang-option-active" : ""}`}
                onClick={() => handleSelect(lang.code)}
              >
                <span className="lang-flag">{lang.flag}</span>
                <div className="lang-text">
                  <span className="lang-native">{lang.native}</span>
                  <span className="lang-english">{lang.name}</span>
                </div>
                {/* Checkmark for current language */}
                {language === lang.code && (
                  <span className="lang-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSelector;