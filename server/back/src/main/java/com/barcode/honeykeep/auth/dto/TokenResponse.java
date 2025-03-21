package com.barcode.honeykeep.auth.dto;

import lombok.Builder;

@Builder
public record TokenResponse(String accessToken, String refreshToken) {
}
