package com.barcode.honeykeep.mydataConnect.controller;

import java.util.List;

import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.cert.exception.CertErrorCode;
import com.barcode.honeykeep.cert.service.SignatureVerificationService;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.mydataConnect.dto.BankConnectForMydataRequest;
import com.barcode.honeykeep.mydataConnect.dto.BankListForMydataResponse;
import com.barcode.honeykeep.mydataConnect.dto.MydataTokenResponse;
import com.barcode.honeykeep.mydataConnect.service.MydataConnectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/mydata")
@RequiredArgsConstructor
public class MydataConnectController {

    private final MydataConnectService mydataConnectService;
    private final SignatureVerificationService signVerifyService;
    private final JwtTokenProvider tokenProvider;

    @Value("${app.cookie.domain}")
    private String cookieDomain;

    /**
     * 마이데이터 서비스 이용을 위한 토큰 발급 API (전자서명 기반)
     */
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<MydataTokenResponse>> requestMydataToken(
            @AuthenticationPrincipal UserId userId,
            @RequestHeader("X-Signature") String signature,
            @RequestHeader("X-Timestamp") String timestamp) {
        // 1. 전자서명 검증
        String method = "POST";
        String url = "/api/v1/mydata/token";

        String dataToVerify = method + "\n" + url + "\n" + timestamp + "\n";

        if (!signVerifyService.verifySignature(userId.value(), dataToVerify, signature)) {
            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
        }

        // 2. 마이데이터 액세스 토큰 발급. 실제로는 마이데이터 중계기관에서 발급 받는다.
        String bankToken = tokenProvider.generateAccessToken(userId.value());

        ResponseCookie bankTokenCookie = ResponseCookie.from("bankToken", bankToken)
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/mydata")
                .maxAge(300)
                .domain(cookieDomain)
                .sameSite("Lax")
                .build();

        // 3. 토큰 저장 및 반환
        return ResponseEntity.ok()
                .header("Set-Cookie", bankTokenCookie.toString())
                .body(ApiResponse.success("마이데이터 토큰 발급 성공", new MydataTokenResponse(bankToken)));
    }

    /**
     * 마이데이터 연동 가능한 은행 목록 조회 API
     */
    @GetMapping("/banks")
    public ResponseEntity<ApiResponse<List<BankListForMydataResponse>>> getAvailableBanks(
            @AuthenticationPrincipal UserId userId,
            @CookieValue(value = "bankToken") String bankToken) {

        // 쿠키가 없으면 토큰 검증 로직 추가
        if (bankToken == null || !tokenProvider.validateToken(bankToken)) {
            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
        }

        List<BankListForMydataResponse> bankList = mydataConnectService.getBankListWithStatus(userId.value());

        return ResponseEntity.ok()
                .body(ApiResponse.success("은행 목록 조회 성공", bankList));
    }

    /**
     * 마이데이터 연동 요청 API
     */
    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<String>> connect(
            @AuthenticationPrincipal UserId userId,
            @CookieValue(value = "bankToken") String bankToken,
            @RequestBody BankConnectForMydataRequest request) {

        // 쿠키가 없으면 토큰 검증 로직 추가
        if (bankToken == null || !tokenProvider.validateToken(bankToken)) {
            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
        }

        mydataConnectService.connect(userId.value(), request.bankCodes());

        return ResponseEntity.ok()
                .body(ApiResponse.success("연동 성공"));
    }

}
