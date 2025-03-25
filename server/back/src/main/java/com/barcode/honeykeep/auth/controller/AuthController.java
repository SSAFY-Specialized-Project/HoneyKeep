package com.barcode.honeykeep.auth.controller;

import java.io.UnsupportedEncodingException;

import com.barcode.honeykeep.auth.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barcode.honeykeep.auth.service.AuthService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterResponse>> register(@RequestBody RegisterRequest request) {
        RegisterResponse response = authService.registerUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입 성공", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        TokenResponse tokens = authService.authenticateUser(request);

        ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", tokens.refreshToken())
                .httpOnly(true)
                .secure(true)          // HTTPS 환경에서만 전송 (https 설정이 아직 안된 상태라 꺼놓음)
                .path("/")              // 필요한 경로 지정
                .domain("localhost")    // ✅ 도메인 설정 필요
                .sameSite("Lax")        // CSRF 방지
                .build();

        LoginResponse response = LoginResponse.builder()
                .accessToken(tokens.accessToken())
                .build();

        return ResponseEntity.ok()
                .header("Set-Cookie", refreshTokenCookie.toString())
                .body(ApiResponse.success("로그인 성공", response));
    }

    @PostMapping("/send-verification")
    public ResponseEntity<ApiResponse<EmailVerifyResponse>> sendVerification(@RequestBody EmailVerifyRequest request) throws UnsupportedEncodingException {
        EmailVerifyResponse response = authService.sendVerification(request);

        return ResponseEntity.ok()
                .body(ApiResponse.success(response));
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Boolean>> verifyEmail(@RequestBody EmailVerifyCodeRequest request) {
        boolean isValid = authService.verifyEmail(request);

        return isValid ?
                ResponseEntity.ok()
                        .body(ApiResponse.success(true)) :
                ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.unauthorized("인증번호가 일치하지 않습니다."));
    }

    @PostMapping("/validate-password")
    public ResponseEntity<ApiResponse<Boolean>> validatePassword(
            @AuthenticationPrincipal UserId userId,
            @RequestBody ValidatePasswordRequest request) {

        boolean isValid = authService.validatePassword(userId.value(), request.password());

        return isValid ?
                ResponseEntity.ok()
                        .body(ApiResponse.success(true)) :
                ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.unauthorized("비밀번호가 일치하지 않습니다."));
    }

    @PostMapping("/validate-user")
    public ResponseEntity<ApiResponse<Boolean>> validateUser(@RequestBody ValidateUserRequest request) {
        boolean isValid = authService.validateUser(request.name(), request.identityNumber(), request.phoneNumber(), request.email());

        return ResponseEntity.ok()
                .body(ApiResponse.success(isValid));
    }
}
