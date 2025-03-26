package com.barcode.honeykeep.mydataConnect.dto;

import lombok.Builder;

public record BankListResponse(
        String bankCode,
        String bankName,
        boolean isLinked
) {
    @Builder
    public BankListResponse {
    }
}
