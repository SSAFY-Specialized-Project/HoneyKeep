package com.barcode.honeykeep.category.dto;

import lombok.Builder;

// 카테고리 수정 응답
@Builder
public record CategoryUpdateResponse(
    Long categoryId,
    String name,
    Integer icon
) {}