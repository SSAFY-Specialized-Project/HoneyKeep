package com.barcode.honeykeep.account.dto;

public record AccountSummaryDto(
        String bankName,
        String accountName,
        String accountNumber
) {
}
