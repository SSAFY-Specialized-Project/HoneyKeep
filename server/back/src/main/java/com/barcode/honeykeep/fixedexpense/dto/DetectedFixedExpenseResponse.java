package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.dto.AccountSummaryDto;
import com.barcode.honeykeep.account.entity.Account;
import lombok.Builder;

@Builder
public record DetectedFixedExpenseResponse(
        Long id,
        AccountSummaryDto account,
        String name,
        String averageAmount,
        Integer averageDay,
        Integer transactionCount
) {
}
