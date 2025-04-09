package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record PocketUseTransactionResponse(
        Long pocketId,
        String pocketName,
        Long previousAmount,
        Long usedAmount,
        Long currentAmount,
        Boolean isExceed
) {}