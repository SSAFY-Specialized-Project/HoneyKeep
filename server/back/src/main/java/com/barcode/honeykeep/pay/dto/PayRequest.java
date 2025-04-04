package com.barcode.honeykeep.pay.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PayRequest {
    Long accountId;
    BigDecimal amount;
    String uuid;
    String productName;
    Long pocketId;
}
