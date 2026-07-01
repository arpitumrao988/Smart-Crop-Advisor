// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/DiseaseDetectRequest.java
//
//  WHAT THIS DTO IS FOR:
//  POST /api/v1/disease/detect
//  Frontend (DiseaseDetect.jsx) sends crop name + symptoms.
//
//  Frontend sends this JSON:
//  {
//    "userId": 1,
//    "cropName": "Rice",
//    "symptoms": "Yellow spots on leaves, wilting, brown edges"
//  }
//
//  DiseaseService uses this to:
//  1. Call Python AI module: POST http://localhost:5000/predict/disease
//     Body: { "crop_name": "Rice", "symptoms": "Yellow spots..." }
//  2. AI returns predicted disease name e.g. "Leaf Blight"
//  3. DiseaseService fetches full DiseaseInfo from DB using disease name
//  4. Saves a Recommendation (type=DISEASE) record
//  5. Returns RecommendationResponse + disease details to frontend
// ============================================================

package com.smartcropadvisor.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record DiseaseDetectRequest(

        // ── cropName ──────────────────────────────────────────
        // The crop the farmer is checking.
        // Examples: "Rice", "Wheat", "Maize", "Cotton", "Sugarcane"
        @NotBlank(message = "Crop name is required")
        String cropName,

        // ── symptoms ──────────────────────────────────────────
        // List of symptoms observed.
        @NotEmpty(message = "Please describe or select at least one symptom")
        List<String> symptoms

) {}
