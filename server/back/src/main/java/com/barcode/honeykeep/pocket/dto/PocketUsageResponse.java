package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record PocketUsageResponse(
        long successAmount,
        long incompleteAmount,
        long exceededAmount
) {}
