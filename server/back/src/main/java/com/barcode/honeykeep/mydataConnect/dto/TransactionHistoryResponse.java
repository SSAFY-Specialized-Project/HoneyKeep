package com.barcode.honeykeep.mydataConnect.dto;

public record TransactionHistoryResponse(
        String transactionUniqueNo,
        String transactionDate,
        String transactionTime,
        String transactionType,
        String transactionTypeName,
        String transactionAccountNo,
        String transactionBalance,
        String transactionAfterBalance,
        String transactionSummary,
        String transactionMemo
) {}
