package com.barcode.honeykeep.notification.service.handler;

import com.barcode.honeykeep.notification.entity.FCMToken;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.notification.service.NotificationService;
import com.barcode.honeykeep.notification.type.PushType;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public abstract class AbstractNotificationHandler implements NotificationHandler {

    protected final FCMTokenRepository fcmTokenRepository;

    // 각 알림 유형에 맞는 데이터 맵을 생성하는 추상 메서드
    protected abstract Map<String, String> buildData(Object messageData);


    @Override
    public void sendNotification(Long userId, Object messageData) {
        // DB에서 FCM 토큰 조회
        List<FCMToken> tokens = fcmTokenRepository.findByUser_Id(userId);
        if (tokens.isEmpty()) {
            log.info("FCM 토큰이 존재하지 않습니다. userId: {}", userId);
            return;
        }

        Map<String, String> data = buildData(messageData);
        log.debug("전송할 data payload: {}", data);

        // 각 토큰에 대해 메시지 생성 및 전송
        for (FCMToken token : tokens) {
            Message fcmMessage = Message.builder()
                    .setToken(token.getToken())
                    .putAllData(data)
                    .build();
            try {
                String response = FirebaseMessaging.getInstance().send(fcmMessage);
                log.info("FCM 메시지 전송 성공 - 토큰: {} / 메시지 ID: {}", token.getToken(), response);


            } catch (FirebaseMessagingException e) {
                log.error("FCM 메시지 전송 실패 - 토큰: {} / 에러: {}", token.getToken(), e.getMessage(), e);
            }
        }
    }
}
