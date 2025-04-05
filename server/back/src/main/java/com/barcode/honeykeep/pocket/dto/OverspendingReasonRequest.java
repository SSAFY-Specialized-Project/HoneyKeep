package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record OverspendingReasonRequest(
        String reasonText
) {}
