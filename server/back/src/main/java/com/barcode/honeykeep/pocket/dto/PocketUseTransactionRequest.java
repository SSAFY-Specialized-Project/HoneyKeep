package com.barcode.honeykeep.pocket.dto;

import lombok.Builder;

@Builder
public record PocketUseTransactionRequest(
        Long transactionId
) {}