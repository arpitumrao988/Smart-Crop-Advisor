import React, { useState } from "react";

function IrrigationAdvisory() {
  const [formData, setFormData] = useState({
    cropType: "",
    soilMoisture: "",
    temperature: "",
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
    // POST /api/v1/recommend/irrigation

    setResult({
      waterRequirement: "1200 Liters / Day",
      frequency: "Every 2 Days",
      note:
        "Maintain adequate soil moisture and avoid excessive irrigation.",
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
          Irrigation Advisory
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter crop and environmental information to receive irrigation
          guidance.
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
              type="text"
              name="cropType"
              placeholder="Crop Type"
              value={formData.cropType}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="number"
              name="soilMoisture"
              placeholder="Soil Moisture (%)"
              value={formData.soilMoisture}
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
            Get Irrigation Advice
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
              Irrigation Recommendation
            </h2>

            <p>
              <strong>Water Requirement:</strong>{" "}
              {result.waterRequirement}
            </p>

            <p>
              <strong>Frequency:</strong> {result.frequency}
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

export default IrrigationAdvisory;
