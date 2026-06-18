// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/model/SoilInput.java
//
//  WHAT IS THIS FILE?
//  This entity maps to the 'soil_inputs' table in MySQL.
//  Every time a farmer submits soil data on the CropRecommend page,
//  we save that data here BEFORE sending it to the AI module.
//
//  WHY DO WE SAVE IT?
//  1. So we can link a Recommendation back to the exact soil data
//     that produced it (traceability).
//  2. So we can show the farmer "what input you gave us" alongside
//     "what we recommended" in their history page.
//  3. The Recommendation entity has a foreign key pointing to this table.
//
//  RELATIONSHIP:
//  One User → Many SoilInputs  (one farmer submits many soil readings)
//  One SoilInput → One Recommendation  (each input produces one recommendation)
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

// ── @Table ───────────────────────────────────────────────────
// Maps to the 'soil_inputs' table in MySQL.
// The underscore naming (soil_inputs) is the database convention.
// Our Java class name is SoilInput (camelCase) — the naming strategy
// in application.properties maps this to soil_inputs automatically,
// but we specify the name explicitly here to be 100% clear.
@Table(name = "soil_inputs")
public class SoilInput {

    // ── PRIMARY KEY ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Maps to: `id` BIGINT PRIMARY KEY AUTO_INCREMENT

    // ── FOREIGN KEY — USER ───────────────────────────────────
    // @ManyToOne = Many SoilInputs belong to ONE User.
    //   A single farmer can submit many soil readings over time.
    //
    // @JoinColumn = defines the foreign key column in THIS table.
    //   name = "user_id" → the column in soil_inputs table that stores the FK
    //   nullable = false → every soil input MUST belong to a user
    //
    // How it works:
    //   When you save a SoilInput with user set → Hibernate inserts:
    //   INSERT INTO soil_inputs (user_id, nitrogen, ...) VALUES (3, 90, ...)
    //   The '3' here is the User's id (primary key from users table).
    //
    // fetch = FetchType.LAZY → Hibernate does NOT automatically load the full
    //   User object when you load a SoilInput. It only loads it if you
    //   actually call soilInput.getUser(). This prevents unnecessary DB queries
    //   and is the recommended default for @ManyToOne relationships.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    // Maps to: `user_id` BIGINT NOT NULL REFERENCES users(id)

    // ── SOIL NUTRIENT VALUES ─────────────────────────────────
    // These are the 7 input fields the farmer fills in on CropRecommend.jsx.
    // They match EXACTLY the features the AI model was trained on.
    // The AI module expects: { "N", "P", "K", "temperature", "humidity", "ph", "rainfall" }

    // Nitrogen content in soil (mg/kg or ppm)
    // Typical range: 0-140
    @Column(nullable = false)
    private Double nitrogen;
    // Maps to: `nitrogen` DOUBLE NOT NULL

    // Phosphorus content in soil (mg/kg or ppm)
    // Typical range: 5-145
    @Column(nullable = false)
    private Double phosphorus;
    // Maps to: `phosphorus` DOUBLE NOT NULL

    // Potassium content in soil (mg/kg or ppm)
    // Typical range: 5-205
    @Column(nullable = false)
    private Double potassium;
    // Maps to: `potassium` DOUBLE NOT NULL

    // Temperature in Celsius
    // Typical range: 8.8-43.7°C
    @Column(nullable = false)
    private Double temperature;
    // Maps to: `temperature` DOUBLE NOT NULL

    // Relative humidity percentage
    // Typical range: 14-99%
    @Column(nullable = false)
    private Double humidity;
    // Maps to: `humidity` DOUBLE NOT NULL

    // Soil pH level (acidity/alkalinity)
    // Range: 0-14. Neutral = 7. Most crops prefer 6-7.5.
    // Column name = "ph" (lowercase, simple name for MySQL)
    @Column(name = "ph", nullable = false)
    private Double ph;
    // Maps to: `ph` DOUBLE NOT NULL

    // Annual rainfall in mm
    // Typical range: 20-298 mm
    @Column(nullable = false)
    private Double rainfall;
    // Maps to: `rainfall` DOUBLE NOT NULL

    // ── TIMESTAMP ────────────────────────────────────────────
    // When this soil reading was submitted.
    // updatable = false → never changes after first INSERT.
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    // Maps to: `created_at` DATETIME

    // ── AUTO-SET TIMESTAMP ON INSERT ─────────────────────────
    // Runs automatically just before this row is inserted into MySQL.
    // RecommendService does NOT need to set createdAt manually.
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}