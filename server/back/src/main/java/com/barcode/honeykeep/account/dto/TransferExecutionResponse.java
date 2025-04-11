package com.barcode.honeykeep.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TransferExecutionResponse {

    private Long withdrawAccountId;
    private BigDecimal withdrawAccountNewBalance;
    private Long depositAccountId;
    private BigDecimal depositAccountNewBalance;
    private String message;
}
