package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record OverspendingReasonCountResponse(
        String label,
        Long count
) {}
