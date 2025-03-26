package com.barcode.honeykeep.fixedexpense.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record FixedExpenseRequest(
        Account account,
        String name,
        Money money,
        LocalDate startDate,
        LocalDate payDay,
        String memo
) {}
