package com.barcode.honeykeep.pay.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class PayDto {
    Long accountId;
    BigDecimal amount;
    String productName;
    Long pocketId;
}
