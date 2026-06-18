// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/model/DiseaseInfo.java
//
//  WHAT IS THIS FILE?
//  This entity maps to the 'disease_info' table in MySQL.
//  It acts as a REFERENCE TABLE — a lookup database of known
//  crop diseases, their symptoms, treatments, and prevention tips.
//
//  HOW IT'S USED:
//  1. The DiseaseService looks up this table after the AI module
//     returns a disease prediction (e.g. "Leaf Blight").
//  2. It fetches the full DiseaseInfo record for "Leaf Blight"
//     and returns the detailed description, treatment, and prevention
//     to the frontend — not just the raw disease name.
//  3. The GET /api/v1/disease/list endpoint returns ALL rows from
//     this table so the frontend can show a disease symptom checklist.
//
//  HOW DATA GETS INTO THIS TABLE:
//  Unlike the other tables (users, soil_inputs, recommendations) which
//  are populated by user actions at runtime, this table is pre-populated
//  with seed data. Run database/seed_data.sql after startup to load it.
//
//  RELATIONSHIP:
//  This table has NO foreign keys — it's a standalone reference/lookup table.
//  It is READ by DiseaseService, not written to during normal app operation.
// ============================================================

package com.smartcropadvisor.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "disease_info")
public class DiseaseInfo {

    // ── PRIMARY KEY ──────────────────────────────────────────
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // Maps to: `id` BIGINT PRIMARY KEY AUTO_INCREMENT

    // ── CROP NAME ────────────────────────────────────────────
    // Which crop this disease affects.
    // Examples: "Rice", "Wheat", "Maize", "Cotton"
    // DiseaseService queries this column to filter diseases
    // by the crop the farmer selected on the frontend.
    @Column(name = "crop_name", nullable = false, length = 100)
    private String cropName;
    // Maps to: `crop_name` VARCHAR(100) NOT NULL

    // ── DISEASE NAME ─────────────────────────────────────────
    // The name of the disease.
    // This is what the AI model predicts and returns.
    // DiseaseService uses this to find the matching DiseaseInfo record.
    // Examples: "Leaf Blight", "Powdery Mildew", "Root Rot", "Rust"
    @Column(name = "disease_name", nullable = false, length = 150)
    private String diseaseName;
    // Maps to: `disease_name` VARCHAR(150) NOT NULL

    // ── SYMPTOMS ─────────────────────────────────────────────
    // A description of the visible symptoms a farmer would see on their crops.
    // TEXT type → can store long descriptions (up to 65,535 characters).
    // This is displayed on the frontend in the disease detection result card.
    // Example: "Yellow or brown spots on leaves, wilting of young plants,
    //           water-soaked lesions on stems, foul smell near roots"
    @Column(columnDefinition = "TEXT")
    private String symptoms;
    // Maps to: `symptoms` TEXT

    // ── TREATMENT ────────────────────────────────────────────
    // What the farmer should do if this disease is detected.
    // Example: "Apply Mancozeb fungicide at 2.5g/L concentration.
    //           Remove and destroy infected plant parts immediately.
    //           Avoid overhead irrigation to reduce moisture on leaves."
    @Column(columnDefinition = "TEXT")
    private String treatment;
    // Maps to: `treatment` TEXT

    // ── PREVENTION ───────────────────────────────────────────
    // What the farmer can do BEFORE the disease occurs to prevent it.
    // Example: "Use disease-resistant varieties. Maintain proper plant spacing
    //           for good air circulation. Rotate crops every season.
    //           Avoid waterlogging in the field."
    @Column(columnDefinition = "TEXT")
    private String prevention;
    // Maps to: `prevention` TEXT
}