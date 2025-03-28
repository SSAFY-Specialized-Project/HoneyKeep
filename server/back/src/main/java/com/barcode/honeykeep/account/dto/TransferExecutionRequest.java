package com.barcode.honeykeep.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class TransferExecutionRequest {
    private Long withdrawAccountId;
    private String depositAccountNumber;
    private BigDecimal transferAmount;
}
