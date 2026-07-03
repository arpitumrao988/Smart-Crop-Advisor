import React, { useState } from "react";
import { getCropRecommendation } from "../services/recommendService";
import RecommendationCard from "../components/RecommendationCard";
import AlertBanner from "../components/AlertBanner";
import Loader from "../components/Loader";
import "./RecommendPages.css";

const FORM_FIELDS = [
  {
    name: "N",
    label: "Nitrogen (N)",
    unit: "mg/kg",
    placeholder: "e.g. 90",
    min: 0,
    max: 140,
  },
  {
    name: "P",
    label: "Phosphorus (P)",
    unit: "mg/kg",
    placeholder: "e.g. 42",
    min: 5,
    max: 145,
  },
  {
    name: "K",
    label: "Potassium (K)",
    unit: "mg/kg",
    placeholder: "e.g. 43",
    min: 5,
    max: 205,
  },
  {
    name: "temperature",
    label: "Temperature",
    unit: "°C",
    placeholder: "e.g. 25.5",
    min: 10,
    max: 45,
  },
  {
    name: "humidity",
    label: "Humidity",
    unit: "%",
    placeholder: "e.g. 80",
    min: 14,
    max: 100,
  },
  {
    name: "ph",
    label: "Soil pH",
    unit: "pH",
    placeholder: "e.g. 6.5",
    min: 3.5,
    max: 10,
  },
  {
    name: "rainfall",
    label: "Rainfall",
    unit: "mm",
    placeholder: "e.g. 202.9",
    min: 20,
    max: 300,
  },
];

function CropRecommend() {
  const initialForm = FORM_FIELDS.reduce(
    (acc, field) => ({ ...acc, [field.name]: "" }),
    {}
  );

  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasEmpty = FORM_FIELDS.some(
      (field) => formData[field.name] === ""
    );

    if (hasEmpty) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setResult(null);

    const numericData = {};

    FORM_FIELDS.forEach((field) => {
      numericData[field.name] = parseFloat(formData[field.name]);
    });

    try {
      const res = await getCropRecommendation(numericData);

      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message || "Failed to get recommendation.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setFormData(initialForm);
    setResult(null);
    setError("");
  };

  return (
    <div className="page-wrapper">
      <div className="container recommend-container">
        <div className="recommend-header">
          <h1>🌾 Crop Recommendation</h1>
          <p>
            Enter your soil and climate data to receive a crop recommendation.
          </p>
        </div>

        {error && (
          <AlertBanner
            type="error"
            message={error}
            onClose={() => setError("")}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div className="fields-grid">
            {FORM_FIELDS.map((field) => (
              <div key={field.name}>
                <label>{field.label}</label>

                <input
                  type="number"
                  step="any"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  disabled={loading}
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </form>

        {loading && (
          <Loader message="AI is analyzing your field data..." />
        )}

        {!loading && result && (
          <RecommendationCard type="crop" data={result} />
        )}
      </div>
    </div>
  );
}

export default CropRecommend;