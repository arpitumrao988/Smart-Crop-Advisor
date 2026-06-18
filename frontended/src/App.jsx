// ============================================================
// App.jsx — Root Component
// Sets up React Router with all page routes
// Wraps the entire app with AuthContext and LanguageContext
// ============================================================

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider, useAuth }         from "./context/AuthContext";
import { LanguageProvider }              from "./context/LanguageContext";  // ← NEW

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home               from "./pages/Home";
import Login              from "./pages/Login";
import Register           from "./pages/Register";
import Dashboard          from "./pages/Dashboard";
import CropRecommend      from "./pages/CropRecommend";
import FertilizerRecommend from "./pages/FertilizerRecommend";
import IrrigationAdvisory  from "./pages/IrrigationAdvisory";
import DiseaseDetect      from "./pages/DiseaseDetect";
import Profile            from "./pages/Profile";

// ── Protected Route ────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

// ── App Component ──────────────────────────────────────────
function App() {
  return (
    // LanguageProvider wraps EVERYTHING — must be outermost
    // so even Navbar can read language state
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* PUBLIC */}
            <Route path="/"         element={<Home />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED */}
            <Route path="/dashboard"           element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/recommend/crop"      element={<ProtectedRoute><CropRecommend /></ProtectedRoute>} />
            <Route path="/recommend/fertilizer" element={<ProtectedRoute><FertilizerRecommend /></ProtectedRoute>} />
            <Route path="/recommend/irrigation" element={<ProtectedRoute><IrrigationAdvisory /></ProtectedRoute>} />
            <Route path="/disease/detect"      element={<ProtectedRoute><DiseaseDetect /></ProtectedRoute>} />
            <Route path="/profile"             element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* CATCH-ALL */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;