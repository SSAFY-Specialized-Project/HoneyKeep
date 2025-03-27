// 7. 포켓 금액 추가 응답 DTO
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record PocketGatherResponse(
    Long id,
    String name,
    Long previousAmount,
    Long addedAmount,
    Long currentAmount,
    Long totalAmount,
    Double progressPercentage,
    LocalDateTime updatedAt
) {}