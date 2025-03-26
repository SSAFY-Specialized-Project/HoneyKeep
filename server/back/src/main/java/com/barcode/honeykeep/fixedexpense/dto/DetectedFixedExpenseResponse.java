package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.entity.Account;
import lombok.Builder;

@Builder
public record DetectedFixedExpenseResponse(
        Long id,
        String bankName,
        String accountName,
        String name,
        String averageAmount,
        Integer averageDay,
        Integer transactionCount
) {
}
