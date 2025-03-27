package com.barcode.honeykeep.mydataConnect.dto;

public record TransactionHistoryRequest(
        String accountNo,
        String transactionUniqueNo
) {}

