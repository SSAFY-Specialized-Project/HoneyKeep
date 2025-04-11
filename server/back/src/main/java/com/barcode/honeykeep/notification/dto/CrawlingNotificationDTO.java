package com.barcode.honeykeep.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CrawlingNotificationDTO {

    private String notificationType;

    private String productName;
}
