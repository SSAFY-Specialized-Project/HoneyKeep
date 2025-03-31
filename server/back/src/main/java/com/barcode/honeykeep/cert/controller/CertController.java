package com.barcode.honeykeep.cert.controller;

import com.barcode.honeykeep.cert.dto.AccountConfirmRequest;
import com.barcode.honeykeep.cert.dto.AccountVerificationRequest;
import com.barcode.honeykeep.cert.dto.RegisterCertificateRequest;
import com.barcode.honeykeep.cert.dto.RegisterCertificateResponse;
import com.barcode.honeykeep.cert.service.CertService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.cert.Certificate;

@Slf4j
@RestController
@RequestMapping("/api/v1/cert")
@RequiredArgsConstructor
public class CertController {

    private final CertService certService;

    /**
     * 1원 인증 요청
     * @param userId
     * @param request
     * @return
     */
    @PostMapping("/verify-account/request")
    public ResponseEntity<ApiResponse<Void>> requestAccountVerification(
            @AuthenticationPrincipal UserId userId,
            @RequestBody AccountVerificationRequest request) {
        certService.sendTransferCode(userId, request);

        return ResponseEntity.ok()
                .body(ApiResponse.success("1원 인증 요청 성공", null));
    }

    /**
     * 1원 인증 검증. 상태코드가 200이 반환된다면 프론트에서는 공개키와 개인키를 만들고, 인증서를 만드는 API를 호출해야 한다.
     * @param userId
     * @param request
     * @return
     */
    @PostMapping("/verify-account/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmAccountVerification(
            @AuthenticationPrincipal UserId userId,
            @RequestBody AccountConfirmRequest request) {
        certService.confirmTransferCode(userId, request);

        return ResponseEntity.ok()
                .body(ApiResponse.success("1원 인증 성공", null));
    }

    /**
     * 인증서 등록 API - 1원 인증 후 클라이언트에서 생성한 공개키로 인증서 발급
     * @param userId 인증된 사용자 ID
     * @param request 공개키가 포함된 요청
     * @return 생성된 인증서 정보
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegisterCertificateResponse>> registerCertificate(
            @AuthenticationPrincipal UserId userId,
            @RequestBody RegisterCertificateRequest request) {
        
        RegisterCertificateResponse response = certService.registerCertificate(userId, request);

        
        return ResponseEntity.ok()
                .body(ApiResponse.success("인증서가 성공적으로 발급되었습니다", response));
    }
}
