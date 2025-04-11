package com.barcode.honeykeep.cert.dto;

public record AccountVerificationRequest(
        String accountNumber,
        String bankCode
) {
}
