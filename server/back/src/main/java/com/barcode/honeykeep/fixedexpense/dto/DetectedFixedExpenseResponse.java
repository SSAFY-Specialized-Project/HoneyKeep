package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.entity.Account;
import lombok.Builder;

@Builder
public record DetectedFixedExpenseResponse(
        Long id,
        Account account,
        String name,
        String averageAmount,
        Integer averageDay,
        Integer transactionCount
) {
}
