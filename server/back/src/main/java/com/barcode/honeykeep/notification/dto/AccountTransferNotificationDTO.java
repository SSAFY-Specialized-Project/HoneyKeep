package com.barcode.honeykeep.notification.dto;

import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class AccountTransferNotificationDTO {

    private String notificationType;

    private TransactionType transactionType;

    private BigDecimal amount;

    private String withdrawAccountName;

    private String depositAccountName;

    private LocalDateTime transferDate;
}
