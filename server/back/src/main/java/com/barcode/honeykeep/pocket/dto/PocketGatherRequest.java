package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.common.vo.Money;

public record PocketGatherRequest(
    Money savedAmount
) {}