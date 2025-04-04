package com.barcode.honeykeep.pocket.dto;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
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
