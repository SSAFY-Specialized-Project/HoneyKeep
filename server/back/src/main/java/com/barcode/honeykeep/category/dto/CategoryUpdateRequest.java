package com.barcode.honeykeep.category.dto;

public record CategoryUpdateRequest(
    String name,
    Integer icon
) {}