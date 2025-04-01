package com.barcode.honeykeep.category.dto;

import lombok.Builder;

// 카테고리 생성 응답
@Builder
public record CategoryCreateResponse(
    Long categoryId,
    String name,
    Integer icon
) {}