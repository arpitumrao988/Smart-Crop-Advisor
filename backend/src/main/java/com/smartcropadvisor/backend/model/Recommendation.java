// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/model/Recommendation.java
//
//  WHAT IS THIS FILE?
//  This entity maps to the 'recommendations' table in MySQL.
//  Every time the AI module returns a prediction, we save it here.
//
//  THIS IS THE MOST IMPORTANT TABLE — it stores:
//  - What type of recommendation was made (CROP, FERTILIZER, etc.)
//  - What the AI predicted (e.g. "Rice")
//  - How confident the AI was (e.g. 94.7%)
//  - An advisory note explaining the recommendation
//  - Which user requested it (FK → users)
//  - Which soil input triggered it (FK → soil_inputs)
//  - When it was created
//
//  This table powers the "History" page on the frontend —
//  GET /api/v1/recommend/history/{userId} reads from this table.
//
//  RELATIONSHIPS:
//  Many Recommendations → One User      (many results for one farmer)
//  Many Recommendations → One SoilInput (one input can have multiple results
//                                         e.g. crop + fertilizer from same data)
// ============================================================

package com.smartcropadvisor.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "recommendations")
public class Recommendation {

    // ── PRIMARY KEY ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Maps to: `id` BIGINT PRIMARY KEY AUTO_INCREMENT

    // ── FOREIGN KEY — USER ───────────────────────────────────
    // Which farmer this recommendation belongs to.
    // FetchType.LAZY = don't load the full User object unless explicitly accessed.
    // This prevents: every time you load a Recommendation, it also runs a
    // separate query to load the User — wasteful when you just need the result.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    // Maps to: `user_id` BIGINT NOT NULL REFERENCES users(id)

    // ── FOREIGN KEY — SOIL INPUT ─────────────────────────────
    // Which soil input data produced this recommendation.
    // nullable = true because disease detection recommendations don't
    // require soil input data — they use crop name + symptoms instead.
    // For crop/fertilizer/irrigation, this will always be set.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "soil_input_id", nullable = true)
    private SoilInput soilInput;
    // Maps to: `soil_input_id` BIGINT REFERENCES soil_inputs(id)

    // ── RECOMMENDATION TYPE ──────────────────────────────────
    // What kind of recommendation this is.
    //
    // @Enumerated(EnumType.STRING) → stores the enum name as a string in MySQL
    //   e.g. stores "CROP" not "0" in the column.
    //   This is much better than EnumType.ORDINAL (which stores 0,1,2,3)
    //   because if you reorder the enum values, ORDINAL breaks all old data.
    //   STRING is always safe and readable in the database.
    //
    // The RecommendationType enum is defined at the bottom of this file.
    @Enumerated(EnumType.STRING)
    @Column(name = "recommendation_type", nullable = false, length = 20)
    private RecommendationType recommendationType;
    // Maps to: `recommendation_type` VARCHAR(20) NOT NULL
    // Possible values stored: "CROP", "FERTILIZER", "IRRIGATION", "DISEASE"

    // ── RESULT ───────────────────────────────────────────────
    // The main prediction output from the AI module.
    // Examples:
    //   CROP        → "Rice"
    //   FERTILIZER  → "Urea"
    //   IRRIGATION  → "45 liters/day, every 3 days"
    //   DISEASE     → "Leaf Blight"
    // columnDefinition = "TEXT" → MySQL TEXT type, can store up to 65,535 chars
    // We use TEXT instead of VARCHAR because result could sometimes be long.
    @Column(nullable = false, columnDefinition = "TEXT")
    private String result;
    // Maps to: `result` TEXT NOT NULL

    // ── CONFIDENCE ───────────────────────────────────────────
    // The AI model's confidence score as a percentage (0.0 to 100.0).
    // Example: 94.7 means the model is 94.7% sure about this prediction.
    // nullable = true because not all recommendation types return a confidence score
    // (irrigation advisory is rule-based, not probabilistic).
    @Column
    private Double confidence;
    // Maps to: `confidence` DOUBLE

    // ── ADVISORY NOTE ────────────────────────────────────────
    // A human-readable explanation or guidance text.
    // Example: "Rice is highly suitable for your soil. Ensure consistent
    //           water supply and monitor humidity during growing season."
    // Built in RecommendService based on the prediction result.
    @Column(name = "advisory_note", columnDefinition = "TEXT")
    private String advisoryNote;
    // Maps to: `advisory_note` TEXT

    // ── TIMESTAMP ────────────────────────────────────────────
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    // Maps to: `created_at` DATETIME

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ================================================================
    //  INNER ENUM — RecommendationType
    //
    //  Defines the 4 types of recommendations our system can make.
    //  Defined as an inner enum here (inside the Recommendation class)
    //  because it is only used by this entity.
    //
    //  If we needed it in multiple places, we'd put it in a separate file:
    //  src/main/java/com/smartcropadvisor/backend/model/RecommendationType.java
    // ================================================================
    public enum RecommendationType {
        // Used by: RecommendController.crop() + RecommendService.getCropRecommendation()
        CROP,

        // Used by: RecommendController.fertilizer() + RecommendService.getFertilizerRecommendation()
        FERTILIZER,

        // Used by: RecommendController.irrigation() + RecommendService.getIrrigationAdvisory()
        IRRIGATION,

        // Used by: DiseaseController.detect() + DiseaseService.detect()
        DISEASE
    }
}