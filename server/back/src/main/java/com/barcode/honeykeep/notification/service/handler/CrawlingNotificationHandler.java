package com.barcode.honeykeep.notification.service.handler;


import com.barcode.honeykeep.notification.dto.CrawlingNotificationDTO;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.notification.type.PushType;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CrawlingNotificationHandler extends AbstractNotificationHandler {

    public CrawlingNotificationHandler(FCMTokenRepository fcmTokenRepository) {
        super(fcmTokenRepository);
    }

    protected Map<String, String> buildData(Object messageData) {
        CrawlingNotificationDTO dto = (CrawlingNotificationDTO) messageData;
        Map<String, String> data = new HashMap<>();
        data.put("notificationType", dto.getNotificationType());
        data.put("productName", dto.getProductName());
        return data;
    }

    @Override
    public PushType getPushType() {
        return PushType.CRAWLING;
    }
}
