package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.common.vo.Money;
import lombok.Builder;

import java.time.LocalDateTime;

public record FixedExpenseResponse(Long id,
                                   String name,
                                   Money money,
                                   LocalDateTime startDate,
                                   LocalDateTime payDay,
                                   String memo) {

    @Builder
    public FixedExpenseResponse {

    }
}