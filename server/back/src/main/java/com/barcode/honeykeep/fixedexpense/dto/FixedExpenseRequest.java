package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.common.vo.Money;

import java.time.LocalDate;

public record FixedExpenseRequest(
        String accountNumber,
        String name,
        Money money,
        LocalDate startDate,
        Integer payDay,
        Integer transactionCount,
        String memo
) {}
