package com.barcode.honeykeep.notification.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.notification.dto.FCMTokenRequest;
import com.barcode.honeykeep.notification.entity.FCMToken;
import com.barcode.honeykeep.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;


    //FCM 토큰 저장 (기기 등록)
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<String>> saveToken(@AuthenticationPrincipal UserId userId,
                                                         @RequestBody FCMTokenRequest request) {
        FCMToken token = notificationService.saveFCMToken(userId.value(), request.getToken());
        return ResponseEntity.ok().body(ApiResponse.success("FCM 토큰이 성공적으로 저장되었습니다.", null));
    }

}
