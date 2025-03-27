// 1. 포켓 상세 조회 응답 DTO (단일 포켓 조회 시 사용)
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record PocketDetailResponse(
    Long id,
    Long accountId,
    String accountName,
    Long categoryId,
    String categoryName,
    String name,
    String productName,
    Long totalAmount,
    Long savedAmount,
    String link,
    String imgUrl,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Boolean isFavorite,
    String type,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}