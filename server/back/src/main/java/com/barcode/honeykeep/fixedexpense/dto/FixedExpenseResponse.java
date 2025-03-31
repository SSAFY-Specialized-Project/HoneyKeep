package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record FixedExpenseResponse(
        Long id,
        String bankName,
        String accountName,
        String name,
        Money money,
        LocalDate startDate,
        LocalDate payDay,
        String memo
) { }