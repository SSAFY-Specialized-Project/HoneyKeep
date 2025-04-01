package com.barcode.honeykeep.category.dto;

public record CategoryCreateRequest(
    String name,
    Integer icon
) {}