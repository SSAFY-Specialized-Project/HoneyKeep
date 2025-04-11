package com.barcode.honeykeep.category.dto;

import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import lombok.Builder;

import java.util.List;

@Builder
public record CategoryWithPocketsResponse(
        Long categoryId,
        String name,
        Integer icon,
        List<PocketSummaryResponse> pockets
) {}