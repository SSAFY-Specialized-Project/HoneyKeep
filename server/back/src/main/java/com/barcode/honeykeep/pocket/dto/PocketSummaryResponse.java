// 2. 포켓 목록 조회용 요약 DTO (목록 조회, 검색 결과 등에 사용)
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record PocketSummaryResponse(
    Long id,
    String name,
    String accountName,
    Long totalAmount,
    Long savedAmount,
    String type,
    Boolean isActivated,
    Boolean isFavorite,
    String imgUrl,
    LocalDateTime endDate
) {}