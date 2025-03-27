package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.transaction.entity.Transaction;
import lombok.Builder;

import java.util.List;

public record FixedExpenseCandidate(
        Long userId,
        Long accountId,
        String merchantName,
        List<Transaction> transactions,
        Double amountScore,
        Double dateScore,
        Double persistenceScore,
        Double totalScore
) {
}
