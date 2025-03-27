package com.barcode.honeykeep.pay.dto;

import com.barcode.honeykeep.common.vo.Money;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PayRequest {
    String account;
    Money amount;
    String uuid;
    String productName;
    String pocketName;
}
