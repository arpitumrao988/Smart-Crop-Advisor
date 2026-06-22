// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/CropRecommendRequest.java
//
//  WHAT THIS DTO IS FOR:
//  POST /api/v1/recommend/crop
//  Frontend (CropRecommend.jsx) sends the 7 soil parameter values.
//
//  Frontend sends this JSON:
//  {
//    "nitrogen": 90,
//    "phosphorus": 42,
//    "potassium": 43,
//    "temperature": 20.87,
//    "humidity": 82.00,
//    "ph": 6.5,
//    "rainfall": 202.93,
//    "userId": 1
//  }
//
//  RecommendService uses this to:
//  1. Save a SoilInput record to DB
//  2. Forward these 7 values to Python AI module:
//     POST http://localhost:5000/predict/crop
//     Body: { "N": 90, "P": 42, "K": 43, "temperature": 20.87,
//             "humidity": 82.00, "ph": 6.5, "rainfall": 202.93 }
//  3. Save the AI prediction as a Recommendation record
//  4. Return RecommendationResponse to frontend
// ============================================================

package com.smartcropadvisor.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CropRecommendRequest(

        // ── N (nitrogen) ──────────────────────────────────────────
        // Nitrogen content in soil (mg/kg)
        // Mapped from JSON field "N"
        @JsonProperty("N")
        @NotNull(message = "Nitrogen value is required")
        @Positive(message = "Nitrogen must be a positive value")
        Double nitrogen,

        // ── P (phosphorus) ────────────────────────────────────────
        // Mapped from JSON field "P"
        @JsonProperty("P")
        @NotNull(message = "Phosphorus value is required")
        @Positive(message = "Phosphorus must be a positive value")
        Double phosphorus,

        // ── K (potassium) ─────────────────────────────────────────
        // Mapped from JSON field "K"
        @JsonProperty("K")
        @NotNull(message = "Potassium value is required")
        @Positive(message = "Potassium must be a positive value")
        Double potassium,

        // ── temperature ───────────────────────────────────────
        @NotNull(message = "Temperature value is required")
        @DecimalMin(value = "-10.0", message = "Temperature seems too low")
        @DecimalMax(value = "60.0", message = "Temperature seems too high")
        Double temperature,

        // ── humidity ──────────────────────────────────────────
        @NotNull(message = "Humidity value is required")
        @DecimalMin(value = "0.0", message = "Humidity cannot be negative")
        @DecimalMax(value = "100.0", message = "Humidity cannot exceed 100%")
        Double humidity,

        // ── ph ────────────────────────────────────────────────
        @NotNull(message = "pH value is required")
        @DecimalMin(value = "0.0", message = "pH cannot be less than 0")
        @DecimalMax(value = "14.0", message = "pH cannot exceed 14")
        Double ph,

        // ── rainfall ──────────────────────────────────────────
        @NotNull(message = "Rainfall value is required")
        @Positive(message = "Rainfall must be a positive value")
        Double rainfall

) {}