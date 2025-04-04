package com.barcode.honeykeep.notification.dto;

import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayNotificationDTO {

    private TransactionType transactionType;

    private BigDecimal amount;

    private String withdrawAccountName;

    private String productName;

    // 이체 일시 (알림에 포함할 시간 정보)
    private LocalDateTime transferDate;
}

