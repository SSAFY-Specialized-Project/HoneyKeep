// 3. 포켓 생성 응답 DTO
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record PocketCreateResponse(
    Long id,
    String name,
    Long accountId,
    String accountName,
    Long totalAmount,
    Long savedAmount,
    String link,
    LocalDateTime startDate,
    LocalDateTime endDate,
    Boolean isFavorite,
    String type,
    LocalDateTime createdAt
) {}