package com.smartcropadvisor.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcropadvisor.backend.dto.DiseaseDetectRequest;
import com.smartcropadvisor.backend.dto.DiseaseDetectResponse;
import com.smartcropadvisor.backend.model.DiseaseInfo;
import com.smartcropadvisor.backend.model.Recommendation;
import com.smartcropadvisor.backend.model.Recommendation.RecommendationType;
import com.smartcropadvisor.backend.model.User;
import com.smartcropadvisor.backend.repository.DiseaseInfoRepository;
import com.smartcropadvisor.backend.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DiseaseService {

    private static final Logger log = LoggerFactory.getLogger(DiseaseService.class);

    private final DiseaseInfoRepository diseaseInfoRepository;
    private final RecommendationRepository recommendationRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public DiseaseService(DiseaseInfoRepository diseaseInfoRepository,
                          RecommendationRepository recommendationRepository,
                          RestTemplate restTemplate,
                          ObjectMapper objectMapper) {
        this.diseaseInfoRepository = diseaseInfoRepository;
        this.recommendationRepository = recommendationRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Value("${ai.module.base-url}")
    private String aiBaseUrl;

    // ── DETECT DISEASE ───────────────────────────────────────
    @Transactional
    public DiseaseDetectResponse detectDisease(User user, DiseaseDetectRequest request) {
        log.info("Processing disease detection for user: {}, crop: {}", user.getEmail(), request.cropName());

        // 1. Call Python AI module
        String url = aiBaseUrl + "/predict/disease";
        Map<String, Object> aiRequest = Map.of(
                "crop", request.cropName(),
                "symptoms", request.symptoms()
        );

        String predictedDisease;

        try {
            Map<?, ?> aiResponse = restTemplate.postForObject(url, aiRequest, Map.class);
            if (aiResponse != null && aiResponse.containsKey("prediction")) {
                predictedDisease = (String) aiResponse.get("prediction");
            } else {
                throw new RuntimeException("Empty response from AI server.");
            }
        } catch (Exception e) {
            log.error("Failed to connect to Python AI module at {}.", url, e);
            throw new RuntimeException("AI disease detection service is currently offline. Please ensure the AI server is running.");
        }

        // 2. Query DiseaseInfo reference table in MySQL
        Optional<DiseaseInfo> diseaseInfoOpt = diseaseInfoRepository.findByDiseaseName(predictedDisease);

        String severity = "Low";
        String treatment = "No treatment required. Crop appears healthy.";
        String prevention = "Maintain regular crop monitoring and standard watering schedule.";

        if (diseaseInfoOpt.isPresent()) {
            DiseaseInfo diseaseInfo = diseaseInfoOpt.get();
            severity = predictedDisease.toLowerCase().contains("healthy") ? "Low" : "Medium";
            treatment = diseaseInfo.getTreatment();
            prevention = diseaseInfo.getPrevention();
        } else if (!predictedDisease.toLowerCase().contains("healthy")) {
            severity = "Medium";
            treatment = "Consult local agricultural extension office. Remove infected leaves/plants immediately to prevent spread. Apply general-purpose organic fungicide if fungal characteristics are present.";
            prevention = "Maintain clean farming equipment, keep proper spacing between crops, and avoid overhead watering.";
        }

        // 3. Save recommendation to database
        String advisoryNoteJson = "";
        try {
            Map<String, Object> noteMap = Map.of(
                    "severity", severity,
                    "treatment", treatment,
                    "prevention", prevention
            );
            advisoryNoteJson = objectMapper.writeValueAsString(noteMap);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize disease detection metadata", e);
        }

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .soilInput(null)
                .recommendationType(RecommendationType.DISEASE)
                .result(predictedDisease)
                .advisoryNote(advisoryNoteJson)
                .build();
        recommendation = recommendationRepository.save(recommendation);

        return new DiseaseDetectResponse(
                predictedDisease,
                severity,
                treatment,
                prevention,
                recommendation.getCreatedAt()
        );
    }

    // ── LIST ALL DISEASES ────────────────────────────────────
    @Transactional(readOnly = true)
    public List<DiseaseInfo> getAllDiseases() {
        log.info("Fetching all disease reference records");
        return diseaseInfoRepository.findAll();
    }
}
