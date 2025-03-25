package com.barcode.honeykeep.fixedexpense.dto;

import lombok.Builder;

@Builder
public record DetectedFixedExpenseResponse(
        Long id,
        String name,
        String averageAmount,
        Integer averageDay,
        Integer transactionCount
) {
}
