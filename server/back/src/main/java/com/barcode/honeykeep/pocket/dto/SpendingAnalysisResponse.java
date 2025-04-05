package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

import java.util.List;

@Builder
public record SpendingAnalysisResponse(
        String userType,
        long plannedAmount,
        long unplannedAmount,
        long pocketTotal,
        PocketUsageResponse pocketUsage,
        List<OverspendingReasonCountResponse> overspendingReasons
) {}

