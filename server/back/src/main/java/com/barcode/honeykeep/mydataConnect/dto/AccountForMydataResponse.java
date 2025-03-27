package com.barcode.honeykeep.mydataConnect.dto;

import lombok.Builder;

public record AccountForMydataResponse(
        String accountNumber,
        String bankName,
        long balance
) {
    @Builder
    public AccountForMydataResponse {}
}
