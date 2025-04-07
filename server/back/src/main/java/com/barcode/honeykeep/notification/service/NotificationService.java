package com.barcode.honeykeep.notification.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.notification.dto.NotificationResponse;
import com.barcode.honeykeep.notification.entity.Notification;
import com.barcode.honeykeep.notification.exception.NotificationErrorCode;
import com.barcode.honeykeep.notification.repository.NotificationRepository;
import com.barcode.honeykeep.notification.type.PushType;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    @Transactional
    public Notification saveNotification(Long userId, PushType type, String title, String body){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException((UserErrorCode.USER_NOT_FOUND)));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .body(body)
                .isRead(false)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        log.info("알림 저장 완료 - 사용자ID: {}, 알림ID: {}", userId, savedNotification.getId());
        return savedNotification;
    }

    public List<NotificationResponse> getNotifications(Long userId){
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(notification -> NotificationResponse.builder()
                        .id(notification.getId())
                        .type(notification.getType())
                        .title(notification.getTitle())
                        .body(notification.getBody())
                        .isRead(notification.getIsRead())
                        .createdAt(notification.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationResponse notificationAsRead(Long userId, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()-> new CustomException(NotificationErrorCode.NOTIFICATION_NOT_FOUND));

        // 알림의 소유자가 인증된 사용자와 일치하는지 검증
        if (!notification.getUser().getId().equals(userId)){
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        //읽음 처리
        notification.markAsRead();


        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .body(notification.getBody())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();

    }
}
