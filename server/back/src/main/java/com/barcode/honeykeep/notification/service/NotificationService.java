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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final FCMTokenRepository fcmTokenRepository;
    private final UserRepository userRepository;


    //계좌 이체 알림
    @Transactional
    public void sendWithdrawalNotification(Long userId, AccountTransferNotificationDTO message) {
        // DB에서 해당 사용자의 모든 FCM 토큰 조회 (한 사용자가 여러 기기를 사용한다고 가정)
        List<FCMToken> tokens = fcmTokenRepository.findByUser_Id(userId);


        if (tokens.isEmpty()) {
            System.out.println("토큰이 없습니다. " + userId);
            return;
        }

        // 각 토큰으로 FCM 알림 전송
        for (FCMToken token : tokens) {
            // FCM 메시지 생성: setToken()은 해당 기기의 고유 토큰을 지정하며,
            // setNotification()은 사용자에게 표시될 알림 제목과 본문을 설정합니다.
            Message fcmMessage = Message.builder()
                    .setToken(token.getToken())
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(message.getTitle())
                            .setBody(message.getBody())
                            .build())
                    .build();
            try {
                // FirebaseMessaging을 사용하여 FCM 서버에 메시지를 전송합니다.
                // send() 메서드는 메시지 전송 성공 시 메시지 ID(String)를 반환합니다.
                String response = FirebaseMessaging.getInstance().send(fcmMessage);
                System.out.println("출금 알림 전송 성공 message ID: " + response);
            } catch (FirebaseMessagingException e) {
                // 5. 전송 실패 시 해당 토큰에 대한 에러 메시지를 출력합니다.
                System.err.println("출금 알림 전송 실패 " + token.getToken() + ": " + e.getMessage());
            }
        }


    }

    /**
     * 입금 알림 전송 메서드
     *
     * DB에서 해당 사용자의 모든 FCM 토큰을 조회한 후, 각 토큰에 대해 FCM 메시지를 생성하고 전송합니다.
     *
     * @param userId  입금 계좌 사용자 ID
     * @param message 입금 알림 정보를 담은 DTO (제목, 본문, 이체 일시 등)
     */
    public void sendDepositNotification(Long userId, AccountTransferNotificationDTO message) {
        // 1. DB에서 해당 사용자에 연결된 모든 FCM 토큰을 조회합니다.
        List<FCMToken> tokens = fcmTokenRepository.findByUser_Id(userId);

        // 2. 만약 토큰이 없다면, 로그를 남기고 메서드를 종료합니다.
        if (tokens.isEmpty()) {
            System.out.println("토큰이 없습니다. " + userId);
            return;
        }

        // 3. 각 토큰에 대해 FCM 메시지를 생성하고 전송합니다.
        for (FCMToken token : tokens) {
            Message fcmMessage = Message.builder()
                    .setToken(token.getToken())
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(message.getTitle())
                            .setBody(message.getBody())
                            .build())
                    .build();
            try {
                // 4. FCM 서버에 메시지 전송; 성공 시 메시지 ID 반환
                String response = FirebaseMessaging.getInstance().send(fcmMessage);
                System.out.println("입금 알림 전송 성공 message ID: " + response);
            } catch (FirebaseMessagingException e) {
                // 5. 전송 실패 시 에러 메시지 출력
                System.err.println("입금 알림 전송 실패 " + token.getToken() + ": " + e.getMessage());
            }
        }
    }




    //클라이언트한테 받은 FCM 토큰 저장
    public FCMToken saveFCMToken(Long userId, String token) {

        Optional<FCMToken> optionalToken  = fcmTokenRepository.findByToken(token);

        //만약 이미 토큰이 존재할 때
        if(optionalToken.isPresent()) {
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
            return fcmTokenRepository.save(newToken);
        }

    }

}
