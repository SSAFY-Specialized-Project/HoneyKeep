// 4. 포켓 수정 응답 DTO
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record PocketUpdateResponse(
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
    LocalDateTime updatedAt
) {}