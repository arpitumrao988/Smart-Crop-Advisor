package com.smartcropadvisor.backend.controller;

import com.smartcropadvisor.backend.dto.DiseaseDetectRequest;
import com.smartcropadvisor.backend.dto.DiseaseDetectResponse;
import com.smartcropadvisor.backend.model.DiseaseInfo;
import com.smartcropadvisor.backend.model.User;
import com.smartcropadvisor.backend.service.DiseaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/disease")
@RequiredArgsConstructor
@Slf4j
public class DiseaseController {

    private final DiseaseService diseaseService;

    // ── POST /api/v1/disease/detect ──────────────────────────
    @PostMapping("/detect")
    public ResponseEntity<DiseaseDetectResponse> detectDisease(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody DiseaseDetectRequest request
    ) {
        log.info("Received disease detection request from user: {}", user.getEmail());
        DiseaseDetectResponse response = diseaseService.detectDisease(user, request);
        return ResponseEntity.ok(response);
    }

    // ── GET /api/v1/disease/list ─────────────────────────────
    @GetMapping("/list")
    public ResponseEntity<List<DiseaseInfo>> getDiseaseList() {
        log.info("Received request for supported disease list");
        List<DiseaseInfo> diseases = diseaseService.getAllDiseases();
        return ResponseEntity.ok(diseases);
    }
}
