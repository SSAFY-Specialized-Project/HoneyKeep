package com.barcode.honeykeep.pay.controller;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.dto.OnlinePayRequest;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.dto.PocketBalanceResult;
import com.barcode.honeykeep.pay.dto.QrResponse;
import com.barcode.honeykeep.pay.exception.PayErrorCode;
import com.barcode.honeykeep.pay.service.PayService;
import com.barcode.honeykeep.webauthn.service.WebAuthnTokenService;
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
    private final WebAuthnTokenService webAuthnTokenService;

    /**
     * 1. 클라이언트에서 QR 생성을 위한 UUID를 요청
     * 2. 해당 UUID는 나중에 결제할 때 Body에 다시 넘어오며, 이를 검증해서 유효한 UUID인지 확인해야 함
     * 왜 POST? -> '새로운 UUID 리소스를 생성'한다는 서버 상태 변경 작업이기 때문
     * @return uuid
     */
    @PostMapping("/qr")
    public ResponseEntity<ApiResponse<QrResponse>> createQr() {
        log.info("QR 생성 요청 시작");
        String uuid = payService.createQr();

        log.info("QR 생성 완료, UUID: {}", uuid);
        return ResponseEntity.ok(ApiResponse.success(
                QrResponse.builder()
                .qrCode(uuid)
                .build())
        );
    }

    /**
     * 결제 요청을 처리한다.
     * 1. 요청으로 생성해둔 QR UUID, 결제 계좌, 결제 금액, 상품 이름, 포켓 정보이 넘어옴
     * 2. QR UUID를 확인해 Redis에 저장이 되어 있는지(1분 안에 생성된 QR인지), 사용한 QR인지 체크
     * 3. 유효하면 결제 금액만큼 계좌에서 차감한다.
     * 4. 반환은 성공/실패 코드와 메세지만 있으면 된다.
     */
    @PostMapping("/payment")
    public ResponseEntity<ApiResponse<Boolean>> pay(@AuthenticationPrincipal UserId userId,
                                                    @RequestBody PayRequest payRequest
                                                    // @CookieValue(value = "authToken") String authToken
    ) {
        log.info("QR 결제 요청 시작, userId: {}, payRequest: {}", userId, payRequest);

        // 인증서 검증
        // webAuthnTokenService.validateAuthToken(authToken, userId.value().toString());

        PocketBalanceResult pocketBalanceResult = payService.pay(userId, payRequest);

        if (pocketBalanceResult.getIsSuccess()) {
            log.info("QR 결제 성공, userId: {}", userId.value());
            return ResponseEntity.ok(ApiResponse.success(true));
        } else {
            log.error("QR 결제 실패, userId: {}, payRequest: {}", userId.value(), payRequest);
            throw new CustomException(PayErrorCode.PAYMENT_FAILED);
        }
    }

    /**
     * 온라인 결제 요청을 처리한다.
     * 결제와 process는 동일하고, QR 검증 부분만 제외한다.
     */

    @PostMapping("/online")
    public ResponseEntity<ApiResponse<Boolean>> onlinePay(@AuthenticationPrincipal UserId userId,
                                                          @RequestBody OnlinePayRequest onlinePayRequest
                                                          //@CookieValue(value = "authToken") String authToken
    ) {
        // 인증서 검증
        // webAuthnTokenService.validateAuthToken(authToken, userId.value().toString());

        log.info("온라인 결제 요청 시작, userId: {}, payRequest: {}", userId, onlinePayRequest);
        PocketBalanceResult pocketBalanceResult = payService.onlinePay(userId, onlinePayRequest);

        if (pocketBalanceResult.getIsSuccess()) {
            if(pocketBalanceResult.getIsExceedPocketBalance()) {
                log.info("포켓 잔액 초과, 잔액 충전 후 결제 완료 userId: {}", userId.value());
                return ResponseEntity.ok(ApiResponse.success("포켓 잔액이 부족하여 연동 계좌에서 잔액 충전 후 결제합니다.", true));
            }

            log.info("온라인 결제 성공, userId: {}", userId.value());
            return ResponseEntity.ok(ApiResponse.success("성공적으로 결제되었습니다.", true));
        } else {
            log.error("온라인 결제 실패, userId: {}, payRequest: {}", userId.value(), onlinePayRequest);
            throw new CustomException(PayErrorCode.PAYMENT_FAILED);
        }
    }
}
