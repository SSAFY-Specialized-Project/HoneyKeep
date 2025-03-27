package com.barcode.honeykeep.mydataConnect.dto;

import lombok.Builder;

public record BankListForMydataResponse(
        String bankCode,
        String bankName,
        boolean isLinked
) {
    @Builder
    public BankListForMydataResponse {
    }
}
