package com.barcode.honeykeep.pay.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pay")
public class PayController {

    private final PayService payService;

    /**
     * QR 코드를 생성하는 엔드포인트
     */
    @PostMapping("/qr")
    public ResponseEntity<ApiResponse<String>> createQr() {
        log.info("QR 생성 요청 시작");
        String uuid = payService.createQr();
        log.info("QR 생성 완료, UUID: {}", uuid);
        return ResponseEntity.ok(ApiResponse.success(uuid));
    }

    /**
     * 결제 요청을 처리하는 엔드포인트
     */
    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<String>> pay(@AuthenticationPrincipal UserId userId,
                                                   @RequestBody PayRequest payRequest) {
        log.info("결제 요청 시작, userId: {}, payRequest: {}", userId, payRequest);
        boolean isSuccess = payService.pay(userId, payRequest);

        if (isSuccess) {
            log.info("결제 성공, userId: {}", userId);
            return ResponseEntity.ok(ApiResponse.success("정상적으로 이체되었습니다."));
        } else {
            log.warn("결제 실패, userId: {}, payRequest: {}", userId, payRequest);
            return ResponseEntity.ok(ApiResponse.badRequest("잘못된 요청입니다."));
        }
    }
}
