import React, { useState } from "react";

function FertilizerRecommend() {
  const [formData, setFormData] = useState({
    cropName: "",
    soilType: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
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
    // POST /api/v1/recommend/fertilizer

    setResult({
      fertilizer: "Urea",
      quantity: "50 kg per acre",
      guidance:
        "Apply in two equal doses during the crop growth period.",
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
          Fertilizer Recommendation
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px",
          }}
        >
          Enter crop and soil information to get fertilizer guidance.
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
              name="cropName"
              placeholder="Crop Name"
              value={formData.cropName}
              onChange={handleChange}
              style={inputStyle}
            />

            <input
              type="text"
              name="soilType"
              placeholder="Soil Type"
              value={formData.soilType}
              onChange={handleChange}
              style={inputStyle}
            />

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
              Recommended Fertilizer: {result.fertilizer}
            </h2>

            <p>
              <strong>Quantity:</strong> {result.quantity}
            </p>

            <p>
              <strong>Application Guidance:</strong>{" "}
              {result.guidance}
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

export default FertilizerRecommend;
