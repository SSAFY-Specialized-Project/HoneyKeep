package com.barcode.honeykeep.notification.service;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.notification.exception.NotificationErrorCode;
import com.barcode.honeykeep.notification.service.handler.NotificationHandler;
import com.barcode.honeykeep.notification.type.PushType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationDispatcher {

    private final List<NotificationHandler> handlers;

    @Async
    public void send(PushType pushType, Long userId, Object messageData) {

        NotificationHandler handler =handlers.stream()
                .filter(h -> h.getPushType().equals(pushType))
                .findFirst()
                .orElseThrow(() -> new CustomException(NotificationErrorCode.UNSUPPORTED_NOTIFICATION_TYPE));

        handler.sendNotification(userId, messageData);
    }

}
