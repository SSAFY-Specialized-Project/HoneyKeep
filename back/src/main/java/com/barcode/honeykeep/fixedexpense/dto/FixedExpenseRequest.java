package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.common.vo.Money;

import java.time.LocalDateTime;

// 인증 붙이고 id 제거
public record FixedExpenseRequest(
        Long userId,
        String name,
        Money money,
        LocalDateTime startDate,
        LocalDateTime payDay,
        String memo
) {}
