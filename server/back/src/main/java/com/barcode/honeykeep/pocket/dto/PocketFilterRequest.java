package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.pocket.type.PocketType;
import java.time.LocalDateTime;

public record PocketFilterRequest(
        Long categoryId,
        PocketType type,
        Boolean isFavorite,
        LocalDateTime startDate,
        LocalDateTime endDate
) {
    // 기본값을 위한 생성자
    public PocketFilterRequest() {
        this(null, null, null, null, null);
    }

    // 기존 파라미터를 유지하면서 새 생성자 추가
    public PocketFilterRequest(Long categoryId, PocketType type, Boolean isFavorite) {
        this(categoryId, type, isFavorite, null, null);
    }
}