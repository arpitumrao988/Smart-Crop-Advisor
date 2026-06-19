package com.smartcropadvisor.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record IrrigationAdvisoryRequest(
        @NotBlank(message = "Crop name is required")
        String cropName,

        @NotBlank(message = "Growth stage is required")
        String growthStage,

        @NotNull(message = "Soil moisture is required")
        @PositiveOrZero(message = "Soil moisture cannot be negative")
        Double soilMoisture,

        @NotNull(message = "Temperature is required")
        Double temperature
) {}
