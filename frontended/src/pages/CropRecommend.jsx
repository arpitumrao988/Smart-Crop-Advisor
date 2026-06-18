import React, { useState } from "react";

function CropRecommend() {
  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
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
    // POST /api/v1/recommend/crop

    setResult({
      crop: "Rice",
      confidence: "94.7%",
      alternatives: "Maize, Jute",
      note:
        "Soil and climate conditions are suitable for rice cultivation.",
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
          maxWidth: "900px",
          margin: "auto",
          background: "#fff",
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
          Crop Recommendation
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter soil and environmental data to get crop recommendations.
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "20px",
            }}
          >
            <input
              type="number"
              name="nitrogen"
              placeholder="Nitrogen (N)"
              value={formData.nitrogen}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="phosphorus"
              placeholder="Phosphorus (P)"
              value={formData.phosphorus}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="potassium"
              placeholder="Potassium (K)"
              value={formData.potassium}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="temperature"
              placeholder="Temperature (°C)"
              value={formData.temperature}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="humidity"
              placeholder="Humidity (%)"
              value={formData.humidity}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="ph"
              placeholder="pH Level"
              value={formData.ph}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="rainfall"
              placeholder="Rainfall (mm)"
              value={formData.rainfall}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "25px",
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
            Get Recommendation
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
              Recommended Crop: {result.crop}
            </h2>

            <p>
              <strong>Confidence:</strong> {result.confidence}
            </p>

            <p>
              <strong>Alternative Crops:</strong>{" "}
              {result.alternatives}
            </p>

            <p>
              <strong>Advisory Note:</strong> {result.note}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxSizing: "border-box",
};

export default CropRecommend;
