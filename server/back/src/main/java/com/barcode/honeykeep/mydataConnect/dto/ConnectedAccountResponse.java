package com.barcode.honeykeep.mydataConnect.dto;

public record ConnectedAccountResponse(
        Long accountId,
        String bankName,
        String accountName,
        String accountNumber
) {
}
