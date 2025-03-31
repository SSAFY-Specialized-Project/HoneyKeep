package com.barcode.honeykeep.category.dto;

import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CategoryWithPocketsResponse {
    private Long categoryId;
    private String name;
    private List<PocketSummaryResponse> pockets;
}