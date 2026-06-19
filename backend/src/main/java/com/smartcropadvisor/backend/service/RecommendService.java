package com.smartcropadvisor.backend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.smartcropadvisor.backend.dto.*;
import com.smartcropadvisor.backend.model.Recommendation;
import com.smartcropadvisor.backend.model.Recommendation.RecommendationType;
import com.smartcropadvisor.backend.model.SoilInput;
import com.smartcropadvisor.backend.model.User;
import com.smartcropadvisor.backend.repository.RecommendationRepository;
import com.smartcropadvisor.backend.repository.SoilInputRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RecommendService {

    private static final Logger log = LoggerFactory.getLogger(RecommendService.class);

    private final RecommendationRepository recommendationRepository;
    private final SoilInputRepository soilInputRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public RecommendService(RecommendationRepository recommendationRepository,
                            SoilInputRepository soilInputRepository,
                            RestTemplate restTemplate,
                            ObjectMapper objectMapper) {
        this.recommendationRepository = recommendationRepository;
        this.soilInputRepository = soilInputRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Value("${ai.module.base-url}")
    private String aiBaseUrl;

    // ── CROP RECOMMENDATION ──────────────────────────────────
    @Transactional
    public CropRecommendResponse getCropRecommendation(User user, CropRecommendRequest request) {
        log.info("Processing crop recommendation for user: {}", user.getEmail());

        // 1. Save soil inputs to database
        SoilInput soilInput = SoilInput.builder()
                .user(user)
                .nitrogen(request.nitrogen())
                .phosphorus(request.phosphorus())
                .potassium(request.potassium())
                .temperature(request.temperature())
                .humidity(request.humidity())
                .ph(request.ph())
                .rainfall(request.rainfall())
                .build();
        soilInput = soilInputRepository.save(soilInput);

        // 2. Prepare payload and call Python AI
        String url = aiBaseUrl + "/predict/crop";
        Map<String, Object> aiRequest = Map.of(
                "N", request.nitrogen(),
                "P", request.phosphorus(),
                "K", request.potassium(),
                "temperature", request.temperature(),
                "humidity", request.humidity(),
                "ph", request.ph(),
                "rainfall", request.rainfall()
        );

        String predictedCrop = "Maize";
        Double confidence = 90.0;

        try {
            Map<?, ?> aiResponse = restTemplate.postForObject(url, aiRequest, Map.class);
            if (aiResponse != null) {
                if (aiResponse.containsKey("prediction")) {
                    predictedCrop = (String) aiResponse.get("prediction");
                }
                if (aiResponse.containsKey("confidence")) {
                    confidence = ((Number) aiResponse.get("confidence")).doubleValue();
                }
            }
        } catch (Exception e) {
            log.error("Failed to connect to Python AI module at {}. Using default fallback prediction.", url, e);
        }

        // 3. Generate alternatives and advisory notes
        List<String> alternatives = getCropAlternatives(predictedCrop);
        String advisoryText = String.format("Based on your soil NPK levels, pH of %.1f, temperature of %.1f°C, and rainfall of %.1fmm, %s is highly recommended. It exhibits strong yield potential under these conditions.",
                request.ph(), request.temperature(), request.rainfall(), predictedCrop);

        // 4. Save recommendation as JSON string in advisoryNote column
        String advisoryNoteJson = "";
        try {
            Map<String, Object> noteMap = Map.of(
                    "alternatives", alternatives,
                    "advisoryNote", advisoryText
            );
            advisoryNoteJson = objectMapper.writeValueAsString(noteMap);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize crop recommendation metadata", e);
        }

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .soilInput(soilInput)
                .recommendationType(RecommendationType.CROP)
                .result(predictedCrop)
                .confidence(confidence)
                .advisoryNote(advisoryNoteJson)
                .build();
        recommendation = recommendationRepository.save(recommendation);

        return new CropRecommendResponse(
                predictedCrop,
                confidence,
                alternatives,
                advisoryText,
                recommendation.getCreatedAt()
        );
    }

    // ── FERTILIZER RECOMMENDATION ─────────────────────────────
    @Transactional
    public FertilizerRecommendResponse getFertilizerRecommendation(User user, FertilizerRecommendRequest request) {
        log.info("Processing fertilizer recommendation for user: {}", user.getEmail());

        // 1. Prepare payload and call Python AI
        String url = aiBaseUrl + "/predict/fertilizer";
        Map<String, Object> aiRequest = Map.of(
                "cropName", request.cropName(),
                "soilType", request.soilType(),
                "nitrogen", request.nitrogen(),
                "phosphorus", request.phosphorus(),
                "potassium", request.potassium()
        );

        String predictedFertilizer = "NPK 19-19-19 (Balanced Fertilizer)";

        try {
            Map<?, ?> aiResponse = restTemplate.postForObject(url, aiRequest, Map.class);
            if (aiResponse != null && aiResponse.containsKey("prediction")) {
                predictedFertilizer = (String) aiResponse.get("prediction");
            }
        } catch (Exception e) {
            log.error("Failed to connect to Python AI module at {}. Using default fallback prediction.", url, e);
        }

        // 2. Generate quantity and guidance
        String quantity = calculateFertilizerQuantity(request.nitrogen(), request.phosphorus(), request.potassium());
        String guidance = String.format("For crop %s in %s soil with Nitrogen=%.1f, Phosphorus=%.1f, Potassium=%.1f, apply %s. Ensure uniform spreading and water the soil immediately after application.",
                request.cropName(), request.soilType(), request.nitrogen(), request.phosphorus(), request.potassium(), predictedFertilizer);

        // 3. Save recommendation
        String advisoryNoteJson = "";
        try {
            Map<String, Object> noteMap = Map.of(
                    "quantity", quantity,
                    "guidance", guidance
            );
            advisoryNoteJson = objectMapper.writeValueAsString(noteMap);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize fertilizer recommendation metadata", e);
        }

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .recommendationType(RecommendationType.FERTILIZER)
                .result(predictedFertilizer)
                .advisoryNote(advisoryNoteJson)
                .build();
        recommendation = recommendationRepository.save(recommendation);

        return new FertilizerRecommendResponse(
                predictedFertilizer,
                quantity,
                guidance,
                recommendation.getCreatedAt()
        );
    }

    // ── IRRIGATION ADVISORY ───────────────────────────────────
    @Transactional
    public IrrigationAdvisoryResponse getIrrigationAdvisory(User user, IrrigationAdvisoryRequest request) {
        log.info("Processing irrigation advisory for user: {}", user.getEmail());

        // 1. Perform rule-based calculations
        double moisture = request.soilMoisture();
        double temp = request.temperature();
        String crop = request.cropName().toLowerCase();
        String stage = request.growthStage().toLowerCase();

        String waterReq;
        String frequency;
        String method;
        String tips;

        if (moisture < 30.0) { // Dry
            waterReq = "8–10 liters/day per plant";
            frequency = temp > 32.0 ? "Once every day (early morning)" : "Once every 2 days";
            method = crop.contains("rice") ? "Flood Irrigation" : "Drip Irrigation";
            tips = "Critical dry levels detected. Irrigate immediately. Drip irrigation is highly recommended to conserve water and target root zones directly.";
        } else if (moisture >= 30.0 && moisture < 65.0) { // Moderate
            waterReq = "4–6 liters/day per plant";
            frequency = "Once every 3–4 days";
            method = "Drip Irrigation";
            tips = "Moisture is at a moderate level. Maintain irrigation schedule but monitor temperature. Avoid waterlogging during " + stage + " stage.";
        } else { // Wet/Adequate
            waterReq = "0 liters (No immediate watering)";
            frequency = "As required (check moisture levels)";
            method = "N/A";
            tips = "Soil moisture is sufficient. No irrigation is needed. Ensure field has proper drainage to avoid root rot.";
        }

        // Adjust based on growth stage
        if (stage.contains("flowering") || stage.contains("fruiting")) {
            tips += " The crop is currently in its sensitive " + request.growthStage() + " stage; water stress now can significantly reduce yields.";
        }

        // 2. Save recommendation
        String advisoryNoteJson = "";
        try {
            Map<String, Object> noteMap = Map.of(
                    "frequency", frequency,
                    "method", method,
                    "tips", tips
            );
            advisoryNoteJson = objectMapper.writeValueAsString(noteMap);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize irrigation advisory metadata", e);
        }

        Recommendation recommendation = Recommendation.builder()
                .user(user)
                .recommendationType(RecommendationType.IRRIGATION)
                .result(waterReq)
                .advisoryNote(advisoryNoteJson)
                .build();
        recommendation = recommendationRepository.save(recommendation);

        return new IrrigationAdvisoryResponse(
                waterReq,
                frequency,
                method,
                tips,
                recommendation.getCreatedAt()
        );
    }

    // ── HISTORICAL RECORDS ───────────────────────────────────
    @Transactional(readOnly = true)
    public List<RecommendationResponse> getHistory(Long userId) {
        log.info("Fetching recommendation history for user ID: {}", userId);
        List<Recommendation> recommendations = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return recommendations.stream()
                .map(rec -> {
                    String rawNote = rec.getAdvisoryNote();
                    String cleanNote = cleanAdvisoryNote(rawNote, rec.getRecommendationType());
                    return new RecommendationResponse(
                            rec.getId(),
                            rec.getRecommendationType(),
                            rec.getResult(),
                            rec.getConfidence(),
                            cleanNote,
                            rec.getCreatedAt()
                    );
                })
                .collect(Collectors.toList());
    }

    // ── HELPER METHODS ───────────────────────────────────────
    private List<String> getCropAlternatives(String predictedCrop) {
        if ("Rice".equalsIgnoreCase(predictedCrop)) {
            return List.of("Jute", "Maize", "Sugarcane");
        } else if ("Maize".equalsIgnoreCase(predictedCrop)) {
            return List.of("Cotton", "Sorghum", "Soybean");
        } else if ("Wheat".equalsIgnoreCase(predictedCrop)) {
            return List.of("Barley", "Mustard", "Gram");
        } else if ("Tomato".equalsIgnoreCase(predictedCrop)) {
            return List.of("Brinjal", "Chilli", "Potato");
        } else if ("Potato".equalsIgnoreCase(predictedCrop)) {
            return List.of("Tomato", "Onion", "Radish");
        } else if ("Tea".equalsIgnoreCase(predictedCrop)) {
            return List.of("Coffee", "Cardamom");
        } else if ("Grapes".equalsIgnoreCase(predictedCrop)) {
            return List.of("Pomegranate", "Banana");
        }
        return List.of("Maize", "Mungbean", "Blackgram");
    }

    private String calculateFertilizerQuantity(double n, double p, double k) {
        if (n < 45.0) {
            return "75-80 kg per acre";
        } else if (p < 30.0 || k < 25.0) {
            return "50-60 kg per acre";
        }
        return "35-40 kg per acre";
    }

    private String cleanAdvisoryNote(String advisoryNoteJson, RecommendationType type) {
        if (advisoryNoteJson == null || advisoryNoteJson.trim().isEmpty()) {
            return "";
        }
        if (!advisoryNoteJson.trim().startsWith("{")) {
            return advisoryNoteJson; // Return raw string if not JSON
        }
        try {
            Map<?, ?> map = objectMapper.readValue(advisoryNoteJson, Map.class);
            Object val = null;
            switch (type) {
                case CROP:
                    val = map.get("advisoryNote");
                    break;
                case FERTILIZER:
                    val = map.get("guidance");
                    break;
                case IRRIGATION:
                    val = map.get("tips");
                    break;
                case DISEASE:
                    val = map.get("treatment");
                    break;
            }
            return val instanceof String ? (String) val : "";
        } catch (Exception e) {
            log.error("Failed to parse advisoryNote JSON metadata from history", e);
            return advisoryNoteJson;
        }
    }

}
