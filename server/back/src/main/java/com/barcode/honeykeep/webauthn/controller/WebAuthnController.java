package com.barcode.honeykeep.webauthn.controller;

import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.webauthn.dto.*;
import com.barcode.honeykeep.webauthn.service.WebAuthnService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/webauthn")
@RequiredArgsConstructor
public class WebAuthnController {

    private final WebAuthnService webAuthnService;
    private final JwtTokenProvider tokenProvider;

    @Value("${app.cookie.domain}")
    private String cookieDomain;

    /**
     * WebAuthn 등록 시작
     * 클라이언트에 등록에 필요한 challenge와 옵션 반환
     */
    @PostMapping("/register/start")
    public ResponseEntity<WebAuthnResponse<?>> startRegistration(
            @AuthenticationPrincipal UserId userId,
            @Valid @RequestBody RegistrationRequest request) {

        // 요청으로부터 userId 설정
        request = new RegistrationRequest(
                userId.value(),
                request.displayName(),
                request.authenticatorAttachment(),
                request.userVerification()
        );
        WebAuthnResponse<?> response = webAuthnService.startRegistration(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * WebAuthn 등록 완료
     * 클라이언트로부터 받은 인증 데이터를 검증하고 사용자 인증정보 저장
     */
    @PostMapping("/register/finish")
    public ResponseEntity<WebAuthnResponse<?>> finishRegistration(
            @AuthenticationPrincipal UserId userId,
            @Valid @RequestBody RegistrationFinishRequest request) {

        WebAuthnResponse<?> response = webAuthnService.finishRegistration(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * WebAuthn 인증 시작
     * 클라이언트에 인증에 필요한 challenge와 옵션 반환
     */
    @PostMapping("/authenticate/start")
    public ResponseEntity<WebAuthnResponse<?>> startAuthentication(
            @AuthenticationPrincipal UserId userId,
            @Valid @RequestBody(required = false) AuthenticationRequest request) {

        request = new AuthenticationRequest(
                userId.value(), request.userVerification()
        );

        WebAuthnResponse<?> response = webAuthnService.startAuthentication(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * WebAuthn 인증 완료
     * 클라이언트로부터 받은 인증 데이터를 검증하고 인증 결과 반환
     */
    @PostMapping("/authenticate/finish")
    public ResponseEntity<WebAuthnResponse<?>> finishAuthentication(
            @AuthenticationPrincipal UserId userId,
            @Valid @RequestBody AuthenticationFinishRequest request) {

        WebAuthnResponse<?> response = webAuthnService.finishAuthentication(request);

        // 인증에 대한 임시 토큰 발급 후 쿠키에 저장. 제한시간 5분
        String authToken = tokenProvider.generateAccessToken(userId.value());

        ResponseCookie authTokenCookie = ResponseCookie.from("authToken", authToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(300)
                .domain(cookieDomain)
                .sameSite("Lax")
                .build();

        if (response.isSuccess()) {
            return ResponseEntity.ok()
                    .header("Set-Cookie", authTokenCookie.toString())
                    .body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    /**
     * 사용자의 등록된 WebAuthn 인증정보 목록 조회
     */
    @GetMapping("/credentials")
    public ResponseEntity<ApiResponse<?>> getCredentials(
            @AuthenticationPrincipal UserId userId) {

        WebAuthnResponse<?> response = webAuthnService.getCredentials(userId.value());

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getData()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.badRequest(response.getMessage()));
        }
    }

    /**
     * WebAuthn 인증정보 삭제 (논리적 삭제 - 상태만 REVOKED로 변경)
     */
    @DeleteMapping("/credentials/{credentialId}")
    public ResponseEntity<ApiResponse<?>> revokeCredential(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long credentialId) {

        WebAuthnResponse<?> response = webAuthnService.revokeCredential(userId.value(), credentialId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(ApiResponse.success(response.getMessage()));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.badRequest(response.getMessage()));
        }
    }
} 