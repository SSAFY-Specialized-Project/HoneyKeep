package com.barcode.honeykeep.notification.service.handler;

import com.barcode.honeykeep.notification.dto.PocketReminderNotificationDTO;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.notification.type.PushType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RemindNotificationHandler extends AbstractNotificationHandler {


    public RemindNotificationHandler(FCMTokenRepository fcmTokenRepository) {
        super(fcmTokenRepository);
    }

    @Override
    public PushType getPushType() {
        return PushType.REMINDER;
    }

    @Override
    protected Map<String, String> buildData(Object messageData) {
        PocketReminderNotificationDTO dto = (PocketReminderNotificationDTO) messageData;
        Map<String, String> data = new HashMap<>();
        data.put("notificationType", dto.getNotificationType());
        data.put("userName", dto.getUserName());
        data.put("pocketName", dto.getPocketName());
        return data;
    }
}
