package com.barcode.honeykeep.pay.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PocketBalanceResult {
    Boolean isSuccess;
    Boolean isExceedPocketBalance;
}
