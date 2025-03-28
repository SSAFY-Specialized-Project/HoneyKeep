package com.barcode.honeykeep.transaction.dto;

import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record TransactionListResponse(
        List<Transaction> transactions
) {
    @Builder
    public record Transaction(
            Long id,
            String name,
            Long amount,
            Long balance,
            LocalDateTime date,
            TransactionType type
    ) {}
}