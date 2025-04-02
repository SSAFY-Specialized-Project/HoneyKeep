package com.barcode.honeykeep.cert.controller;

import com.barcode.honeykeep.cert.dto.AccountConfirmRequest;
import com.barcode.honeykeep.cert.dto.AccountVerificationRequest;
import com.barcode.honeykeep.cert.dto.RegisterCertificateRequest;
import com.barcode.honeykeep.cert.dto.RegisterCertificateResponse;
import com.barcode.honeykeep.cert.service.CertService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.mydataConnect.dto.*;
import com.barcode.honeykeep.mydataConnect.service.MydataConnectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    private final MydataConnectService mydataConnectService;

    /**
     *
     * 선택한 계좌 연동을 위한 1원 인증 요청 API
     */
    @PostMapping("/accounts/auth")
    public ResponseEntity<ApiResponse<BankAuthForMydataResponse>> requestAccountAuth(
            @AuthenticationPrincipal UserId userId,
            @RequestBody BankAuthForMydataRequest request) {

        BankAuthForMydataResponse response = mydataConnectService.requestAccountAuth(
                userId.value(), request.accountNo()
        );

        return ResponseEntity.ok(ApiResponse.success("1원 인증 요청 성공", response));
    }

    /**
     *
     * 선택한 계좌의 거래내역(단건) 조회 API
     */
    @PostMapping("/accounts/transaction")
    public ResponseEntity<ApiResponse<TransactionHistoryResponse>> inquireTransactionHistory(
            @AuthenticationPrincipal UserId userId,
            @RequestBody TransactionHistoryRequest request) {

        TransactionHistoryResponse response = mydataConnectService.inquireTransactionHistory(userId.value(), request);
        return ResponseEntity.ok(ApiResponse.success("거래내역 조회 성공", response));
    }

    /**
     *
     * 선택한 계좌 연동을 위한 1원 인증 검증 요청 API
     * 상태코드가 200이 반환된다면 프론트에서는 공개키와 개인키를 만들고, 인증서를 만드는 API를 호출해야 한다
     */
    @PostMapping("/accounts/verify")
    public ResponseEntity<ApiResponse<Void>> verifyAccountAuth(
            @AuthenticationPrincipal UserId userId,
            @RequestBody AccountVerifyForMydataRequest request) {

        mydataConnectService.verifyAccountAuth(userId.value(), request);
        return ResponseEntity.ok(ApiResponse.success("계좌 인증 및 저장 성공", null));
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

        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("인증서가 성공적으로 발급되었습니다", response));
    }
}
