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

import { useLanguage } from "../context/LanguageContext";

import { translateTerm } from "../translations/translations";

import RecommendationCard from "../components/RecommendationCard";

import AlertBanner        from "../components/AlertBanner";

import Loader             from "../components/Loader";

import "./RecommendPages.css";

import "./DiseaseDetect.css";



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

  const { language } = useLanguage();



  const symptomMapHi = {

    "Yellow leaves": "पीली पत्तियां (Yellow Leaves)",

    "Brown spots on leaves": "पत्तियों पर भूरे धब्बे (Brown spots)",

    "Wilting stems": "तनों का मुरझाना (Wilting stems)",

    "White powder on leaves": "पत्तियों पर सफेद पाउडर (White powder)",

    "Black lesions": "काले घाव/धब्बे (Black lesions)",

    "Stunted growth": "रुका हुआ विकास (Stunted growth)",

    "Root rot": "जड़ों का सड़ना (Root rot)",

    "Leaf curl": "पत्तियों का सिकुड़ना (Leaf curl)",

    "Fruit discoloration": "फलों का फीका पड़ना (Fruit discoloration)",

    "Premature fruit drop": "फलों का समय से पहले गिरना",

    "Water-soaked patches": "पानी से भीगे हुए धब्बे",

    "Rusty orange pustules": "जंग जैसे नारंगी धब्बे"

  };

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

      setError(language === "hi" ? "कृपया प्रभावित फसल का चयन करें।" : "Please select your crop first.");

      return;

    }



    // Combine checkbox symptoms with custom text symptom

    const allSymptoms = [...selectedSymptoms];

    if (customSymptom.trim()) {

      allSymptoms.push(customSymptom.trim());

    }



    if (allSymptoms.length === 0) {

      setError(language === "hi" ? "कृपया कम से कम एक लक्षण चुनें या उसका वर्णन करें।" : "Please select or describe at least one symptom.");

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

          <h1 className="recommend-title">

            {language === "hi" ? "🦠 रोग पहचान" : "🦠 Disease Detection"}

          </h1>

          <p className="recommend-subtitle">

            {language === "hi"

              ? "अपनी फसल का चयन करें और दिखाई दे रहे लक्षणों का वर्णन करें। हमारा AI संभावित रोग की पहचान करेगा और उपचार का सुझाव देगा।"

              : "Select your crop and describe the symptoms you're observing. Our AI will identify the likely disease and suggest treatment."

            }

          </p>

        </div>



        <div className="recommend-layout">



          {/* ── Left: Form ─────────────────────────────────── */}

          <div className="recommend-form-section">

            <div className="card">

                            <h2 className="form-section-title">

                {language === "hi" ? "📋 समस्या का वर्णन करें" : "📋 Describe the Problem"}

              </h2>



              {error && (

                <AlertBanner type="error" message={error} onClose={() => setError("")} />

              )}



              <form onSubmit={handleSubmit} noValidate>



                                {/* Crop Selection */}

                <div className="form-group">

                  <label className="form-label" htmlFor="cropName">

                    {language === "hi" ? "प्रभावित फसल" : "Affected Crop"}

                  </label>

                  <select

                    id="cropName" className="form-input"

                    value={cropName}

                    onChange={e => { setCropName(e.target.value); setError(""); }}

                    disabled={loading}

                  >

                    <option value="">{language === "hi" ? "-- प्रभावित फसल चुनें --" : "-- Select affected crop --"}</option>

                    {CROP_OPTIONS.map(c => (

                      <option key={c} value={c}>{translateTerm(c, language)}</option>

                    ))}

                  </select>

                </div>



                                {/* Symptom Checkboxes */}

                <div className="form-group">

                  <label className="form-label">

                    {language === "hi" ? "दिखाई देने वाले लक्षण" : "Observed Symptoms"}

                  </label>

                  <p className="field-tip">

                    {language === "hi" ? "पौधे पर दिखाई देने वाले सभी लक्षणों का चयन करें:" : "Select all symptoms you can see on the plant:"}

                  </p>

                  <div className="symptoms-grid">

                    {COMMON_SYMPTOMS.map(symptom => (

                      <label key={symptom} className="symptom-checkbox">

                        <input

                          type="checkbox"

                          checked={selectedSymptoms.includes(symptom)}

                          onChange={() => toggleSymptom(symptom)}

                          disabled={loading}

                        />

                        <span className="symptom-label">

                          {language === "hi" ? (symptomMapHi[symptom] || symptom) : symptom}

                        </span>

                      </label>

                    ))}

                  </div>

                </div>



                                {/* Custom Symptom Text Input */}

                <div className="form-group">

                  <label className="form-label" htmlFor="customSymptom">

                    {language === "hi" ? "अतिरिक्त लक्षण विवरण (वैकल्पिक)" : "Additional Symptom Description (Optional)"}

                  </label>

                  <input

                    id="customSymptom"

                    type="text"

                    className="form-input"

                    placeholder={language === "hi" ? "उदा. पत्तियां नाजुक होकर जल्दी झड़ रही हैं" : "e.g. leaves turning brittle and falling early"}

                    value={customSymptom}

                    onChange={e => setCustomSymptom(e.target.value)}

                    disabled={loading}

                  />

                </div>



                                {/* Selected symptoms count */}

                {selectedSymptoms.length > 0 && (

                  <p className="selected-count">

                    ✅ {selectedSymptoms.length} {language === "hi" ? "लक्षण चुने गए" : "symptom(s) selected"}

                  </p>

                )}



                                <div className="form-actions">

                  <button type="submit" className="btn-primary" disabled={loading}>

                    {loading ? (

                      <><span className="btn-spinner" /> {language === "hi" ? "पहचान की जा रही है..." : "Detecting..."}</>

                    ) : (

                      language === "hi" ? "🔬 रोग पहचान करें" : "🔬 Detect Disease"

                    )}

                  </button>

                  <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>

                    {language === "hi" ? "🔄 रीसेट" : "🔄 Reset"}

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

                <h3 className="disease-list-title">

                  {language === "hi" ? "📋 समर्थित रोग" : "📋 Supported Diseases"}

                </h3>

                <p className="text-muted mb-8">

                  {language === "hi" ? "हमारा सिस्टम इन रोगों की पहचान कर सकता है:" : "Our system can identify these diseases:"}

                </p>

                <div className="disease-tags">

                  {diseaseList.slice(0, 12).map(d => (

                    <span key={d.id} className="disease-tag">

                      {translateTerm(d.diseaseName, language)}

                    </span>

                  ))}

                </div>

              </div>

            )}

          </div>



                    {/* ── Right: Result ──────────────────────────────── */}

          <div className="recommend-result-section">

            {loading && <Loader message={language === "hi" ? "AI लक्षणों का विश्लेषण कर रहा है..." : "AI is analyzing symptoms..."} />}



            {!loading && result && (

              <>

                <AlertBanner type="success" message={language === "hi" ? "रोग की पहचान की गई। परिणाम इतिहास में सहेजा गया।" : "Disease detected. Result saved to history."} />

                <RecommendationCard type="disease" data={result} />

              </>

            )}



            {!loading && !result && (

              <div className="result-placeholder">

                <span className="placeholder-icon">🦠</span>

                <h3>{language === "hi" ? "रोग पहचान परिणाम यहाँ दिखाई देगा" : "Disease detection result will appear here"}</h3>

                <p>{language === "hi" ? "आगे बढ़ने के लिए अपनी फसल और कम से कम एक लक्षण चुनें" : "Select your crop and at least one symptom to proceed"}</p>

              </div>

            )}

          </div>



        </div>

      </div>

    </div>

  );

}



export default DiseaseDetect;