package com.smartcropadvisor.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CropRecommendResponse(
        String recommendedCrop,
        Double confidence,
        List<String> alternatives,
        String advisoryNote,
        LocalDateTime savedAt
) {}
