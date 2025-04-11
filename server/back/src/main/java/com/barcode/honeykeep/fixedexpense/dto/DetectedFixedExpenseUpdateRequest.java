package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.entity.Account;

public record DetectedFixedExpenseUpdateRequest(
        String accountNumber,
        String name,
        String averageAmount,
        Integer averageDay
) {
}
