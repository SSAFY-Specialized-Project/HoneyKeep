package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PocketManualRequest {
    LocalDateTime startDate;
    LocalDateTime endDate;
    Account account;
    Long categoryId;
    Money totalAmount;
    Money savedAmount;
    Boolean isFavorite;
    String crawlingUuid;
}
