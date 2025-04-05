package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record SpendingAnalysisResponse(
        String userType,
        long plannedAmount,
        long unplannedAmount,
        long pocketTotal,
        PocketUsageResponse pocketUsage
) {}

