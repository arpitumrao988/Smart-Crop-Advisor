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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1/disease")
public class DiseaseController {

    private static final Logger log = LoggerFactory.getLogger(DiseaseController.class);
    private final DiseaseService diseaseService;

    public DiseaseController(DiseaseService diseaseService) {
        this.diseaseService = diseaseService;
    }

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
