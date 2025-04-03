package com.barcode.honeykeep.notification.dto;

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

    // 알림 제목 (예: "계좌이체 성공")
    private String title;

    // 알림 본문 (예: "금액 100,000원이 성공적으로 이체되었습니다.")
    private String body;

    // 이체 일시 (알림에 포함할 시간 정보)
    private LocalDateTime transferDate;
}
