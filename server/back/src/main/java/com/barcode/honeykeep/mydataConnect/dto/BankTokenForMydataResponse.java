package com.barcode.honeykeep.mydataConnect.dto;

public record BankTokenForMydataResponse(
        String accessToken,
        String tokenType,
        int expiresIn,
        String scope
) {}

