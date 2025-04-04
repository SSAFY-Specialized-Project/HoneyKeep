package com.barcode.honeykeep.notification.service.handler;

import com.barcode.honeykeep.notification.type.PushType;

public interface NotificationHandler{

    PushType getPushType();
    // 알림 전송 로직
    void sendNotification(Long userId, Object messageData);
}
