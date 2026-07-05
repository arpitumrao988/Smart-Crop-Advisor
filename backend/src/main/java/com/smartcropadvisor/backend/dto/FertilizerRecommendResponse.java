package com.smartcropadvisor.backend.dto;

import java.time.LocalDateTime;

public record FertilizerRecommendResponse(
        String fertilizer,
        String quantity,
        String guidance,
        LocalDateTime savedAt
) {}
