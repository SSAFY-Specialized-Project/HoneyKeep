package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;

import java.time.LocalDateTime;

public record PocketCreateRequest(
        String name,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Account account,
        Long categoryId,
        Money totalAmount,
        Money savedAmount
) {}