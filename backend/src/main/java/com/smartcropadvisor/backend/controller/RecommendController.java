package com.smartcropadvisor.backend.controller;

import com.smartcropadvisor.backend.dto.*;
import com.smartcropadvisor.backend.model.User;
import com.smartcropadvisor.backend.service.RecommendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/recommend")
public class RecommendController {

    private static final Logger log = LoggerFactory.getLogger(RecommendController.class);
    private final RecommendService recommendService;

    public RecommendController(RecommendService recommendService) {
        this.recommendService = recommendService;
    }

    // ── POST /api/v1/recommend/crop ──────────────────────────
    @PostMapping("/crop")
    public ResponseEntity<CropRecommendResponse> getCropRecommendation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CropRecommendRequest request
    ) {
        log.info("Received crop recommendation request from user: {}", user.getEmail());
        CropRecommendResponse response = recommendService.getCropRecommendation(user, request);
        return ResponseEntity.ok(response);
    }

    // ── POST /api/v1/recommend/fertilizer ────────────────────
    @PostMapping("/fertilizer")
    public ResponseEntity<FertilizerRecommendResponse> getFertilizerRecommendation(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody FertilizerRecommendRequest request
    ) {
        log.info("Received fertilizer recommendation request from user: {}", user.getEmail());
        FertilizerRecommendResponse response = recommendService.getFertilizerRecommendation(user, request);
        return ResponseEntity.ok(response);
    }

    // ── POST /api/v1/recommend/irrigation ────────────────────
    @PostMapping("/irrigation")
    public ResponseEntity<IrrigationAdvisoryResponse> getIrrigationAdvisory(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody IrrigationAdvisoryRequest request
    ) {
        log.info("Received irrigation advisory request from user: {}", user.getEmail());
        IrrigationAdvisoryResponse response = recommendService.getIrrigationAdvisory(user, request);
        return ResponseEntity.ok(response);
    }

    // ── GET /api/v1/recommend/history/{userId} ───────────────
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<RecommendationResponse>> getRecommendationHistory(
            @AuthenticationPrincipal User user,
            @PathVariable Long userId
    ) {
        log.info("Received history lookup request for userId: {}", userId);

        // Security check: Make sure user is looking up their own history
        if (!user.getId().equals(userId)) {
            log.warn("Access denied: User {} tried to access history of userId {}", user.getEmail(), userId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<RecommendationResponse> history = recommendService.getHistory(userId);
        return ResponseEntity.ok(history);
    }
}
