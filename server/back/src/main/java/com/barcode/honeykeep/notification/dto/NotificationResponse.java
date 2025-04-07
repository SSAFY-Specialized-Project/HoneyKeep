package com.barcode.honeykeep.notification.dto;


import com.barcode.honeykeep.notification.type.PushType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class NotificationResponse {

    private final Long id;
    private final PushType type;
    private final String title;
    private final String body;
    private final Boolean isRead;
    private final LocalDateTime createdAt;
}
