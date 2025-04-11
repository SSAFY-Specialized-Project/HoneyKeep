package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.category.entity.Category;
import com.barcode.honeykeep.common.vo.Money;

import java.time.LocalDateTime;

public record PocketModifyRequest(
    String name,
    String productName,
    String link,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Account account,
    Category category,
    Money totalAmount,
    Money savedAmount,
    Boolean isFavorite,
    String imgUrl
) {}