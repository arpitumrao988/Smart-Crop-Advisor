
import React from "react";

function Dashboard() {
  const farmerName = "Anubhav";

  const recommendations = [
    {
      id: 1,
      type: "Crop Recommendation",
      result: "Rice",
      date: "18 June 2026",
    },
    {
      id: 2,
      type: "Fertilizer Recommendation",
      result: "Urea",
      date: "16 June 2026",
    },
    {
      id: 3,
      type: "Disease Detection",
      result: "Leaf Blight",
      date: "14 June 2026",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f8f4",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Welcome Section */}
      <div
        style={{
          marginBottom: "30px",
        }}
      >
        <h1 style={{ color: "#2e7d32" }}>
          Welcome, {farmerName} 🌾
        </h1>

        <p style={{ color: "#666" }}>
          Manage your agricultural recommendations and advisory services.
        </p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3>Total Recommendations</h3>
          <h2 style={{ color: "#2e7d32" }}>12</h2>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3>Last Recommendation</h3>
          <h2 style={{ color: "#2e7d32" }}>18 June 2026</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ color: "#2e7d32" }}>
          Quick Actions
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "15px",
          }}
        >
          <button style={buttonStyle}>
            Crop Recommendation
          </button>

          <button style={buttonStyle}>
            Fertilizer Recommendation
          </button>

          <button style={buttonStyle}>
            Irrigation Advisory
          </button>

          <button style={buttonStyle}>
            Disease Detection
          </button>

          <button style={buttonStyle}>
            Profile
          </button>
        </div>
      </div>

      {/* Recommendation History */}
      <div>
        <h2 style={{ color: "#2e7d32" }}>
          Recommendation History
        </h2>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "20px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#2e7d32",
                  color: "#fff",
                }}
              >
                <th style={tableHeader}>ID</th>
                <th style={tableHeader}>Type</th>
                <th style={tableHeader}>Result</th>
                <th style={tableHeader}>Date</th>
              </tr>
            </thead>

            <tbody>
              {recommendations.map((item) => (
                <tr key={item.id}>
                  <td style={tableCell}>{item.id}</td>
                  <td style={tableCell}>{item.type}</td>
                  <td style={tableCell}>{item.result}</td>
                  <td style={tableCell}>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "12px 18px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const tableHeader = {
  padding: "12px",
};

const tableCell = {
  padding: "12px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
};

export default Dashboard;
