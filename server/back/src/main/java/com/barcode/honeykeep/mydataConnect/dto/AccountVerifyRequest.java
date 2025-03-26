package com.barcode.honeykeep.mydataConnect.dto;

public record AccountVerifyRequest(
        String accountNo,
        String authCode
) {}
