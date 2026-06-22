package com.smartcropadvisor.backend.dto;

import java.time.LocalDateTime;

public record DiseaseDetectResponse(
        String disease,
        String severity,
        String treatment,
        String prevention,
        LocalDateTime savedAt
) {}
