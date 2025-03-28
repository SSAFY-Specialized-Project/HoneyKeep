package com.barcode.honeykeep.transaction.dto;

import lombok.Builder;

@Builder
public record TransactionMemoRequest(
        String memo
) {}