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
public class TransferValidationResponse {
    //출금
    private Long withdrawAccountId;
    private String withdrawAccountName;
    private BigDecimal withdrawAccountBalance;

    //입금
    private Long depositAccountId;
    private String depositAccountName;
    private BigDecimal depositAccountBalance;
    private String depositAccountUserName;
}
