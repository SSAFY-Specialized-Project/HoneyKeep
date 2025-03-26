package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.entity.Account;

public record DetectedFixedExpenseUpdateRequest(
        Account account,
        String name,
        String averageAmount,
        Integer averageDay
) {
}
