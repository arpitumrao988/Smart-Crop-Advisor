package com.smartcropadvisor.backend.dto;

import java.time.LocalDateTime;

public record IrrigationAdvisoryResponse(
        String waterRequirement,
        String frequency,
        String method,
        String tips,
        LocalDateTime savedAt
) {}
