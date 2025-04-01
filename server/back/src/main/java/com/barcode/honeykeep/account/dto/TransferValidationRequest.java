package com.barcode.honeykeep.account.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class TransferValidationRequest {
    private Long withdrawAccountId;
    private String depositAccountNumber;
}
