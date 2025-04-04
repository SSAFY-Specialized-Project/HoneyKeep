package com.barcode.honeykeep.notification.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.notification.dto.AccountTransferNotificationDTO;
import com.barcode.honeykeep.notification.entity.FCMToken;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.notification.repository.NotificationRepository;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final FCMTokenRepository fcmTokenRepository;
    private final UserRepository userRepository;



    /**
     * 계좌이체 알림 전송 메서드
     *
     * DB에서 해당 사용자의 모든 FCM 토큰을 조회한 후, 각 토큰에 대해 FCM 메시지를 생성하고 전송합니다.
     */
    @Transactional
    public void transferNotification(Long userId, AccountTransferNotificationDTO message) {
        // 1. DB에서 해당 사용자에 연결된 모든 FCM 토큰을 조회합니다.
        List<FCMToken> tokens = fcmTokenRepository.findByUser_Id(userId);

        // 2. 만약 토큰이 없다면, 로그를 남기고 메서드를 종료합니다.
        if (tokens.isEmpty()) {
            log.info("FCM 토큰이 존재하지 않습니다. userId: {}", userId);
            return;
        }

        // DTO에서 필요한 데이터를 문자열 형태로 변환하여 Map에 담습니다.
        Map<String, String> data = new HashMap<>();
        data.put("transactionType", message.getTransactionType().name());  // 예: "WITHDRAWAL" 또는 "DEPOSIT"
        data.put("amount", message.getAmount().toString());
        data.put("withdrawAccountName", message.getWithdrawAccountName());
        data.put("depositAccountName", message.getDepositAccountName());
        data.put("transferDate", message.getTransferDate().toString());

        // 데이터 전달 내용 디버깅 로그 찍기
        log.debug("전송할 data payload: {}", data);

        // 3. 각 토큰에 대해 FCM 메시지를 생성하고 전송합니다.
        for (FCMToken token : tokens) {
            Message fcmMessage = Message.builder()
                    .setToken(token.getToken())
                    .putAllData(data)
                    .build();
            try {
                // 4. FCM 서버에 메시지 전송; 성공 시 메시지 ID 반환
                String response = FirebaseMessaging.getInstance().send(fcmMessage);
                log.info("FCM 메시지 전송 성공 - 토큰: {} / 메시지 ID: {}", token.getToken(), response);
            } catch (FirebaseMessagingException e) {
                // 5. 전송 실패 시 에러 메시지 출력
                log.error("FCM 메시지 전송 실패 - 토큰: {} / 에러: {}", token.getToken(), e.getMessage(), e);
            }
        }
    }




    //클라이언트한테 받은 FCM 토큰 저장
    public FCMToken saveFCMToken(Long userId, String token) {

        Optional<FCMToken> optionalToken  = fcmTokenRepository.findByToken(token);

        //만약 이미 토큰이 존재할 때
        if(optionalToken.isPresent()) {
            log.debug("이미 존재하는 FCM 토큰입니다. token: {}", token);
            return optionalToken.get();
        }
        //토큰 존재 안 할때
        else{
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

            FCMToken newToken = FCMToken.builder()
                    .token(token)
                    .user(user)
                    .build();
            FCMToken savedToken = fcmTokenRepository.save(newToken);
            log.info("새로운 FCM 토큰 저장 성공 - userId: {}, token: {}", userId, token);
            return savedToken;
        }

    }

}
