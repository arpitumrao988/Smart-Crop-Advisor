package com.smartcropadvisor.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record FertilizerRecommendRequest(
        @NotBlank(message = "Crop name is required")
        String cropName,

        @NotBlank(message = "Soil type is required")
        String soilType,

        @NotNull(message = "Nitrogen value is required")
        @Positive(message = "Nitrogen must be a positive value")
        Double nitrogen,

        @NotNull(message = "Phosphorus value is required")
        @Positive(message = "Phosphorus must be a positive value")
        Double phosphorus,

        @NotNull(message = "Potassium value is required")
        @Positive(message = "Potassium must be a positive value")
        Double potassium
) {}
