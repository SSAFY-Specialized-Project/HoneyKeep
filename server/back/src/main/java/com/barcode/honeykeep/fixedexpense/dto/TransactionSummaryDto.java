package com.barcode.honeykeep.fixedexpense.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionSummaryDto(
        Long id,
        String name,
        BigDecimal amount,
        LocalDateTime date
) {
}
