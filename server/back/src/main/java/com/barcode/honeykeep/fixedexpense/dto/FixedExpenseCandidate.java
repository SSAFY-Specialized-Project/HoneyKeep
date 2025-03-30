package com.barcode.honeykeep.fixedexpense.dto;

import java.time.LocalDate;
import java.util.List;

public record FixedExpenseCandidate(
        Long userId,
        Long accountId,
        String merchantName,
        String originName,
        List<TransactionSummaryDto> transactions,
        Double amountScore,
        Double dateScore,
        Double persistenceScore,
        Double periodicityScore,
        Double totalScore,
        Double averageAmount,
        Integer averageDay,
        Double avgInterval,
        LocalDate latestDate,
        Double weekendRatio,
        Double intervalStd,
        Double intervalCv,
        Double continuityRatio,
        Double amountTrendSlope,
        Double amountTrendR2
) {
}
