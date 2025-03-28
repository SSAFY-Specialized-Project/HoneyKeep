package com.barcode.honeykeep.pay.dto;

import lombok.Builder;
import lombok.ToString;
import lombok.Value;
import java.math.BigDecimal;

@Value
@Builder
@ToString
public class PayRequest {
    String account;
    BigDecimal amount;
    String uuid;
    String productName;
    Long pocketId;
    String publicKey;
    String payToken;
}
