package com.balineseretreat.airbnbapis;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record UpdatePropertyImageRequest(
        @NotBlank String slot,
        @NotBlank String url,
        @NotBlank String alt,
        String caption,
        @Positive int displayOrder
) {
}
