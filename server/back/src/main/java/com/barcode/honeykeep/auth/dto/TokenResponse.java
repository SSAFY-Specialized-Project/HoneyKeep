package com.barcode.honeykeep.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken,
        long refreshTokenExpiresIn
) {


}
