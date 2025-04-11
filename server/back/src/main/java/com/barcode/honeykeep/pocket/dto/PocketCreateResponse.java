package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record PocketCreateResponse(
        Long id,
        String name,
        Long accountId,
        String accountName,
        Long categoryId,
        String categoryName,
        Long totalAmount,
        Long savedAmount,
        String imgUrl,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Boolean isFavorite,
        String type,
        Boolean isActivated,
        LocalDateTime createdAt
) {}