package com.barcode.honeykeep.mydataConnect.dto;

import lombok.Builder;

public record AccountResponse(
        String accountNumber,
        String bankName,
        long balance
) {
    @Builder
    public AccountResponse {}
}
