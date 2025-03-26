package com.barcode.honeykeep.mydataConnect.dto;

public record BankTokenResponse(
        String accessToken,
        String tokenType,
        int expiresIn,
        String scope
) {}

