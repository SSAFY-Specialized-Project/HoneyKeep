package com.barcode.honeykeep.notification.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PocketReminderNotificationDTO {

    private final String notificationType;
    private final String userName;
    private final String pocketName;
}
