// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/dto/RecommendationResponse.java
//
//  WHAT THIS DTO IS FOR:
//  This is an OUTGOING DTO — returned to frontend after any
//  recommendation is made (crop, fertilizer, irrigation, disease).
//
//  Frontend receives this JSON:
//  {
//    "id": 5,
//    "recommendationType": "CROP",
//    "result": "Rice",
//    "confidence": 94.7,
//    "advisoryNote": "Rice is highly suitable for your soil conditions...",
//    "createdAt": "2026-06-11T15:30:00"
//  }
//
//  WHY NOT RETURN THE Recommendation ENTITY DIRECTLY?
//  The Recommendation entity has @ManyToOne relationships to User and SoilInput.
//  If we return the entity directly, Jackson would try to serialize those
//  linked objects too — causing either infinite loops or loading too much data.
//  This DTO gives the frontend exactly what it needs, nothing more.
//
//  USED FOR:
//  → Response after POST /api/v1/recommend/crop
//  → Response after POST /api/v1/recommend/fertilizer
//  → Response after POST /api/v1/recommend/irrigation
//  → Response after POST /api/v1/disease/detect
//  → Items in the list from GET /api/v1/recommend/history/{userId}
// ============================================================

package com.smartcropadvisor.backend.dto;

import com.smartcropadvisor.backend.model.Recommendation.RecommendationType;

import java.time.LocalDateTime;

public record RecommendationResponse(

        // ── id ────────────────────────────────────────────────
        // Database ID of this recommendation.
        // Frontend can use this to fetch details of a specific recommendation.
        Long id,

        // ── type ────────────────────────────────
        // One of: CROP, FERTILIZER, IRRIGATION, DISEASE
        // Frontend uses this to show the right icon/color on the history card.
        RecommendationType type,

        // ── result ────────────────────────────────────────────
        // The main AI prediction output.
        // Examples: "Rice", "Urea", "45 liters/day", "Leaf Blight"
        String result,

        // ── confidence ────────────────────────────────────────
        // AI confidence score as percentage. Can be null for rule-based results.
        // Frontend shows: "Confidence: 94.7%"
        Double confidence,

        // ── advisoryNote ──────────────────────────────────────
        // Human-readable explanation built by the service layer.
        // Frontend displays this in the result card below the prediction.
        String advisoryNote,

        // ── createdAt ─────────────────────────────────────────
        // When this recommendation was generated.
        // Frontend shows this in the history list:
        // "Jun 11, 2026 at 3:30 PM"
        LocalDateTime createdAt

) {
    // ── Static factory method ─────────────────────────────
    // A convenience method to build a RecommendationResponse
    // directly from a Recommendation entity object.
    //
    // Instead of calling the constructor with all 6 fields manually
    // every time in the service layer, we just call:
    //   RecommendationResponse.from(recommendation)
    //
    // This keeps RecommendService clean — one line instead of six.
    public static RecommendationResponse from(
            com.smartcropadvisor.backend.model.Recommendation recommendation
    ) {
        return new RecommendationResponse(
                recommendation.getId(),
                recommendation.getRecommendationType(),
                recommendation.getResult(),
                recommendation.getConfidence(),
                recommendation.getAdvisoryNote(),
                recommendation.getCreatedAt()
        );
    }
}