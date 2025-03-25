package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;

import java.time.LocalDateTime;

public record PocketCreateRequest(
    String link,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Account account,
    Money totalAmount,
    Money savedAmount,
    Boolean isFavorite
) {}