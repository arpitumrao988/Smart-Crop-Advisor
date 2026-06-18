// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/repository/DiseaseInfoRepository.java
//
//  WHAT IS THIS FILE?
//  Repository for the 'disease_info' table.
//  This table is a READ-ONLY reference/lookup table —
//  we never insert into it at runtime.
//  It gets populated once via database/seed_data.sql.
//
//  WHO USES THIS?
//  DiseaseService.java:
//    → findByDiseaseName()  — after AI predicts "Leaf Blight", fetch full details
//    → findByCropName()     — fetch all diseases for a specific crop
//    → findAll()            — power the GET /api/v1/disease/list endpoint
// ============================================================

package com.smartcropadvisor.backend.repository;

import com.smartcropadvisor.backend.model.DiseaseInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiseaseInfoRepository extends JpaRepository<DiseaseInfo, Long> {

    // ── findByDiseaseName ─────────────────────────────────────
    // Auto-generated SQL:
    //   SELECT * FROM disease_info WHERE disease_name = ?
    //
    // PRIMARY USE: After the AI module returns a disease prediction
    // (e.g. "Leaf Blight"), DiseaseService calls this to get the
    // full details — symptoms, treatment, prevention — to send
    // back to the frontend alongside the AI prediction.
    //
    // Returns Optional<DiseaseInfo> because the AI might predict a disease
    // name that doesn't exist in our reference table yet.
    // DiseaseService handles the empty case gracefully.
    //
    // USED IN: DiseaseService.detect() after calling AI module
    Optional<DiseaseInfo> findByDiseaseName(String diseaseName);

    // ── findByCropName ────────────────────────────────────────
    // Auto-generated SQL:
    //   SELECT * FROM disease_info WHERE crop_name = ?
    //
    // Returns all diseases that can affect a specific crop.
    // Example: findByCropName("Rice") returns Leaf Blight, Brown Spot,
    //          Bacterial Leaf Scald, etc. — all Rice diseases in our table.
    //
    // USED IN: DiseaseService.getDiseasesByCrop(cropName)
    //          → powers the symptom checklist on DiseaseDetect.jsx
    //            (dropdown: select your crop → see all possible diseases)
    List<DiseaseInfo> findByCropName(String cropName);

    // ── findByCropNameIgnoreCase ──────────────────────────────
    // Auto-generated SQL:
    //   SELECT * FROM disease_info WHERE LOWER(crop_name) = LOWER(?)
    //
    // Same as findByCropName but case-insensitive.
    // Prevents issues where frontend sends "rice" but DB has "Rice".
    // IgnoreCase = Spring adds LOWER() on both sides of the comparison.
    //
    // USED IN: DiseaseService as a safer alternative to findByCropName
    List<DiseaseInfo> findByCropNameIgnoreCase(String cropName);

    // Note: findAll() is already provided FREE by JpaRepository.
    // DiseaseService calls findAll() directly for GET /api/v1/disease/list
    // No need to define it here.
}