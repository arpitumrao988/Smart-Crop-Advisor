// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/repository/SoilInputRepository.java
//
//  WHAT IS THIS FILE?
//  Repository for the 'soil_inputs' table.
//  Handles saving soil data submitted by farmers before
//  sending it to the AI module for prediction.
//
//  WHO USES THIS?
//  RecommendService.java — saves soil input data before calling AI module.
//  The saved SoilInput id is then linked to the Recommendation that results from it.
//
//  FLOW IN RecommendService:
//  1. Farmer submits soil data from CropRecommend.jsx
//  2. RecommendService saves it:  soilInputRepository.save(soilInput)
//  3. RecommendService calls AI:  POST http://localhost:5000/predict/crop
//  4. AI returns prediction
//  5. RecommendService saves recommendation with the soilInput linked to it
// ============================================================

package com.smartcropadvisor.backend.repository;

import com.smartcropadvisor.backend.model.SoilInput;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoilInputRepository extends JpaRepository<SoilInput, Long> {

    // ── findByUserId ──────────────────────────────────────────
    // Auto-generated SQL:
    //   SELECT * FROM soil_inputs
    //   WHERE user_id = ?
    //   ORDER BY created_at DESC
    //
    // Fetches all soil readings ever submitted by a specific farmer.
    // Useful if we want to show the farmer their input history
    // (what soil data they submitted in the past).
    //
    // USED IN: RecommendService — optionally fetch past soil inputs for a user
    List<SoilInput> findByUserIdOrderByCreatedAtDesc(Long userId);
}