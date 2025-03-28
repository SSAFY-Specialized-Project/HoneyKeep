// 6. 포켓 즐겨찾기 변경 응답 DTO
package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record PocketFavoriteResponse(
    Long id,
    String name,
    Boolean isFavorite
) {}