package com.barcode.honeykeep.fixedexpense.dto;

public record DetectedFixedExpenseUpdateRequest(
    String name,
    String averageAmount,
    Integer averageDay
) {
}
