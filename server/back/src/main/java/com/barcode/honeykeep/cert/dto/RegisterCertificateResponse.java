package com.barcode.honeykeep.cert.dto;

import java.time.LocalDateTime;

public record RegisterCertificateResponse(
    Long id,
    String serialNumber,
    LocalDateTime expiryDate,
    String status
) {
} 