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

export default DiseaseDetect;
