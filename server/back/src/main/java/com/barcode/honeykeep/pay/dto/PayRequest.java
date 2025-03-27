package com.barcode.honeykeep.pay.dto;

import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;

@Value
@Builder
public class PayRequest {
    String account;
    BigDecimal amount;
    String uuid;
    String productName;
    String pocketName;
    String publicKey;
    String payToken;
}
