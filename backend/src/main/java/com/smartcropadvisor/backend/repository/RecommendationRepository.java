// ============================================================
//  FILE LOCATION:
//  src/main/java/com/smartcropadvisor/backend/repository/RecommendationRepository.java
//
//  WHAT IS THIS FILE?
//  Repository for the 'recommendations' table.
//  Handles saving new recommendations and fetching history.
//
//  WHO USES THIS?
//  RecommendService.java — saves crop/fertilizer/irrigation results
//  DiseaseService.java   — saves disease detection results
//  RecommendService.java — fetches history for the dashboard page
//    (GET /api/v1/recommend/history/{userId})
// ============================================================

package com.smartcropadvisor.backend.repository;

import com.smartcropadvisor.backend.model.Recommendation;
import com.smartcropadvisor.backend.model.Recommendation.RecommendationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    // ── findByUserIdOrderByCreatedAtDesc ──────────────────────
    // Auto-generated SQL:
    //   SELECT * FROM recommendations
    //   WHERE user_id = ?
    //   ORDER BY created_at DESC
    //
    // Breaking down the method name:
    //   findBy          → SELECT * FROM recommendations WHERE...
    //   UserId          → user_id = ? (matches 'user' field in Recommendation.java,
    //                     Spring navigates the @ManyToOne relationship to get user.id)
    //   OrderBy         → ORDER BY
    //   CreatedAt       → created_at column
    //   Desc            → DESC (newest first)
    //
    // Returns List<Recommendation> — all recommendations for this farmer,
    // newest first. This is what the Dashboard history page shows.
    //
    // USED IN: RecommendService.getHistory(userId)
    //          → called by RecommendController GET /api/v1/recommend/history/{userId}
    List<Recommendation> findByUserIdOrderByCreatedAtDesc(Long userId);

    // ── findByUserIdAndRecommendationType ─────────────────────
    // Auto-generated SQL:
    //   SELECT * FROM recommendations
    //   WHERE user_id = ?
    //   AND recommendation_type = ?
    //   ORDER BY created_at DESC
    //
    // Useful when the frontend wants to filter history by type.
    // Example: "Show me only my CROP recommendations"
    //          "Show me only my DISEASE detection history"
    //
    // RecommendationType is our enum: CROP, FERTILIZER, IRRIGATION, DISEASE
    //
    // USED IN: RecommendService.getHistoryByType(userId, type)
    //          → optional filtering feature on the Dashboard page
    List<Recommendation> findByUserIdAndRecommendationTypeOrderByCreatedAtDesc(
            Long userId,
            RecommendationType recommendationType
    );

    // ── countByUserId ─────────────────────────────────────────
    // Auto-generated SQL:
    //   SELECT COUNT(*) FROM recommendations WHERE user_id = ?
    //
    // Returns total number of recommendations made by this farmer.
    // Displayed on the Dashboard as a summary stat:
    // "You have made 12 recommendations so far"
    //
    // USED IN: UserService.getDashboardStats(userId)
    long countByUserId(Long userId);
}