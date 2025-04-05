package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.dto.AccountSummaryDto;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record FixedExpenseResponse(
        Long id,
        AccountSummaryDto account,
        String name,
        Money money,
        LocalDate startDate,
        Integer payDay,
        Integer transactionCount,
        String memo
) { }