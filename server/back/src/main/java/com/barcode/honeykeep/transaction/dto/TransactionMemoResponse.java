package com.barcode.honeykeep.transaction.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TransactionMemoResponse(
        Long id,
        String memo
) {}