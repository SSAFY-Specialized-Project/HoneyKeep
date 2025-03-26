// 5. 포켓 상태 변경 응답 DTO (사용, 완료, 취소 등)
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record PocketStatusResponse(
    Long id,
    String name,
    String type,
    Long savedAmount
) {} 