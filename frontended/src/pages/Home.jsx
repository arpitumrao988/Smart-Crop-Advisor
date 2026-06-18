import React from "react";

function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f4",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          textAlign: "center",
          padding: "100px 20px 80px",
        }}
      >
        <h1
          style={{
            fontSize: "4rem",
            color: "#2e7d32",
            marginBottom: "20px",
          }}
        >
          🌾 Smart Crop Advisor
        </h1>

        <p
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            fontSize: "20px",
            lineHeight: "1.8",
            color: "#555",
          }}
        >
          A modern agricultural advisory platform designed to assist
          farmers in making better decisions related to crop selection,
          fertilizer usage, irrigation planning, and crop disease
          management.
        </p>

        <div style={{ marginTop: "40px" }}>
          <button
            style={{
              padding: "14px 30px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              marginRight: "15px",
            }}
          >
            Login
          </button>

          <button
            style={{
              padding: "14px 30px",
              background: "white",
              color: "#2e7d32",
              border: "2px solid #2e7d32",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Register
          </button>
        </div>
      </div>

      {/* About Section */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#2e7d32",
            marginBottom: "20px",
          }}
        >
          About The Project
        </h2>

        <p
          style={{
            color: "#555",
            lineHeight: "1.8",
            fontSize: "17px",
          }}
        >
          Smart Crop Advisor is a web-based platform that helps users
          access agricultural guidance through crop recommendations,
          fertilizer suggestions, irrigation support, and disease
          identification services. The objective is to provide a simple,
          organized, and user-friendly environment for agricultural
          decision-making.
        </p>
      </div>

      {/* Features */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "60px auto",
          padding: "20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "40px",
          }}
        >
          Our Services
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🌱 Crop Recommendation</h3>
            <p>
              Identify suitable crops based on agricultural conditions
              and available inputs.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🧪 Fertilizer Guidance</h3>
            <p>
              Receive recommendations for fertilizer usage according to
              crop and soil requirements.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>💧 Irrigation Advisory</h3>
            <p>
              Support irrigation planning through water requirement
              guidance and scheduling.
            </p>
          </div>

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h3>🦠 Disease Detection</h3>
            <p>
              Assist users in identifying crop diseases and possible
              treatment measures.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: "80px",
          textAlign: "center",
          padding: "25px",
          background: "#2e7d32",
          color: "white",
        }}
      >
        <p>© 2026 Smart Crop Advisor. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
