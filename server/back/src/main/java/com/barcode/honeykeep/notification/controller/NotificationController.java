package com.barcode.honeykeep.notification.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.notification.dto.FCMTokenRequest;
import com.barcode.honeykeep.notification.dto.NotificationResponse;
import com.barcode.honeykeep.notification.entity.FCMToken;
import com.barcode.honeykeep.notification.entity.Notification;
import com.barcode.honeykeep.notification.service.FCMTokenService;
import com.barcode.honeykeep.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final FCMTokenService FCMService;
    private final NotificationService notificationService;


    //FCM 토큰 저장 (기기 등록)
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<String>> saveToken(@AuthenticationPrincipal UserId userId,
                                                         @RequestBody FCMTokenRequest request) {
        FCMToken token = FCMService.saveFCMToken(userId.value(), request.getToken());
        return ResponseEntity.ok().body(ApiResponse.success("FCM 토큰이 성공적으로 저장되었습니다.", null));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotificationList(@AuthenticationPrincipal UserId userId) {
        List<NotificationResponse> notificationList = notificationService.getNotifications(userId.value());
        return (notificationList == null || notificationList.isEmpty())
                ? ResponseEntity.ok().body(ApiResponse.noContent("알림이 존재하지 않습니다.", null))
                : ResponseEntity.ok().body(ApiResponse.success(notificationList));
    }

    // 단일 알림 읽음 처리 엔드포인트
    @PatchMapping("/{notificationId}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotification(@AuthenticationPrincipal UserId userId,
                                           @PathVariable Long notificationId) {

        return ResponseEntity.ok().body(ApiResponse.success(notificationService.notificationAsRead(userId.value(), notificationId)));
    }

}
