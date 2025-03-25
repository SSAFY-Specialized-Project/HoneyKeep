package com.barcode.honeykeep.pay.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.pay.service.PayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pay")
public class PayController {

    private final PayService payService;

    /**
     * 1. 클라이언트에서 QR 생성을 위한 UUID를 요청
     * 2. 해당 UUID는 나중에 결제할 때 Body에 다시 넘어오며, 이를 검증해서 유효한 UUID인지 확인해야 함
     * 왜 POST? -> '새로운 UUID 리소스를 생성'한다는 서버 상태 변경 작업이기 때문
     * @return uuid
     */
    @PostMapping("/qr")
    public ResponseEntity<ApiResponse<String>> createQr() {
        String uuid = payService.createQr();

        return ResponseEntity.ok(
                ApiResponse.success(uuid)
        );
    }
}
