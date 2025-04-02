package com.barcode.honeykeep.mydataConnect.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.barcode.honeykeep.mydataConnect.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.cert.exception.CertErrorCode;
import com.barcode.honeykeep.cert.service.SignatureVerificationService;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.mydataConnect.service.MydataConnectService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/mydata")
@RequiredArgsConstructor
public class MydataConnectController {
    private final MydataConnectService mydataConnectService;

    private final SignatureVerificationService signVerifyService;
    private final JwtTokenProvider tokenProvider;

    /**
     * 마이데이터 서비스 이용을 위한 토큰 발급 API (전자서명 기반)
     */
    @PostMapping("/token")
    public ResponseEntity<ApiResponse<MydataTokenResponse>> requestMydataToken(
            @AuthenticationPrincipal UserId userId,
            @RequestHeader("X-Signature") String signature) {


        /**
         * 1743556104696
         * 1743556108144
         */
        // 1. 전자서명 검증
        Map<String, Object> dataToVerify = Map.of("timestamp", System.currentTimeMillis());
        if (!signVerifyService.verifySignature(userId.value(), signature, dataToVerify)) {
            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
        }

        // 2. 마이데이터 액세스 토큰 발급
        String token = UUID.randomUUID().toString(); // 실제로는 마이데이터 중계기관에서 발급

        // 3. 토큰 저장 및 반환
        return ResponseEntity.ok()
                .body(ApiResponse.success("마이데이터 토큰 발급 성공", new MydataTokenResponse(token)));
    }

    /**
     * 마이데이터 연동 가능한 은행 목록 조회 API
     */
    @Deprecated
    @GetMapping("/banks")
    public ResponseEntity<ApiResponse<List<BankListForMydataResponse>>> getAvailableBanks(
            @AuthenticationPrincipal UserId userId) {

        List<BankListForMydataResponse> bankList = mydataConnectService.getBankListWithStatus(userId.value());

        return ResponseEntity.ok(ApiResponse.success("은행 목록 조회 성공", bankList));
    }

    /**
     * 마이데이터 연동 요청 API
     */
    @Deprecated
    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<String>> connectInstitution(
            @AuthenticationPrincipal UserId userId,
            @RequestBody BankConnectForMydataRequest request) {

        String token = mydataConnectService.connectInstitution(userId.value(), request.bankCodes());

        return ResponseEntity.ok(ApiResponse.success("기관 연동 요청 성공", token));
    }
//    /**
//     * 선택한 은행에서 연동할 수 있는 계좌 목록 요청 API
//     */
//    @Deprecated
//    @GetMapping("/accounts")
//    public ResponseEntity<ApiResponse<List<AccountForMydataResponse>>> getAccounts(
//            @AuthenticationPrincipal UserId userId,
//            @RequestHeader("Mydata-Access-Token") String mydataToken) {
//
//        List<AccountForMydataResponse> accounts = mydataConnectService.getAccounts(userId.value(), mydataToken);
//
//        return ResponseEntity.ok(ApiResponse.success("계좌 목록 조회 성공", accounts));

//    }

//    /**
//     * 연동 가능한 은행 목록 조회 API (마이데이터 토큰 기반)
//     */
//    @GetMapping("/banks")
//    public ResponseEntity<ApiResponse<List<BankListForMydataResponse>>> getAvailableBanks(
//            @AuthenticationPrincipal UserId userId,
//            @RequestHeader("Mydata-Access-Token") String mydataToken) {
//
//        // 토큰 유효성 검증
//        if (!tokenProvider.validateToken(mydataToken)) {
//            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
//        }
//
//        // 은행 목록 조회
//        List<BankListForMydataResponse> bankList = mydataConnectService.getBankListWithStatus(userId.value());
//
//        return ResponseEntity.ok()
//                .body(ApiResponse.success("은행 목록 조회 성공", bankList));
//    }
//
//    /**
//     * 은행 연동 API (마이데이터 토큰 및 전자서명 기반)
//     */
//    @PostMapping("/connect")
//    public ResponseEntity<ApiResponse<String>> connectInstitution(
//            @AuthenticationPrincipal UserId userId,
//            @RequestHeader("Mydata-Access-Token") String mydataToken,
//            @RequestHeader("X-Electronic-Signature") String signature,
//            @RequestBody BankConnectForMydataRequest request) {
//
//        // 1. 토큰 유효성 검증
//        if (!tokenProvider.validateToken(mydataToken)) {
//            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
//        }
//
//        // 2. 전자서명 검증 (중요 작업이므로 이중 인증)
//        if (!signVerifyService.verifySignature(userId.value(), request, signature)) {
//            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
//        }
//
//        // 3. 은행 연동 처리
//        String connectionId = mydataConnectService.connectInstitution(userId.value(), request.bankCodes());
//
//        return ResponseEntity.ok()
//                .body(ApiResponse.success("기관 연동 요청 성공", connectionId));
//    }
//
//    /**
//     * 선택한 은행의 계좌 연동 API (마이데이터 토큰 및 전자서명 기반)
//     */
//    @PostMapping("/accounts/link")
//    public ResponseEntity<ApiResponse<String>> linkAccount(
//            @AuthenticationPrincipal UserId userId,
//            @RequestHeader("Mydata-Access-Token") String mydataToken,
//            @RequestHeader("X-Electronic-Signature") String signature,
//            @RequestBody AccountVerifyForMydataRequest request) {
//
//        // 1. 토큰 유효성 검증
//        if (!tokenProvider.validateToken(mydataToken)) {
//            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
//        }
//
//        // 2. 전자서명 검증
//        if (!signVerifyService.verifySignature(userId.value(), request, signature)) {
//            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
//        }
//
//        // 3. 계좌 인증 및 연동
//        mydataConnectService.verifyAccountAuth(userId.value(), request);
//
//        return ResponseEntity.ok()
//                .body(ApiResponse.success("계좌 연동 성공", request.accountNo()));
//    }
//
//    /**
//     * 연동된 계좌 목록 조회 API (마이데이터 토큰 기반)
//     */
//    @GetMapping("/accounts/linked")
//    public ResponseEntity<ApiResponse<List<AccountForMydataResponse>>> getLinkedAccounts(
//            @AuthenticationPrincipal UserId userId,
//            @RequestHeader("Mydata-Access-Token") String mydataToken) {
//
//        // 토큰 유효성 검증
//        if (!tokenProvider.validateToken(mydataToken)) {
//            throw new CustomException(AuthErrorCode.JWT_TOKEN_EXPIRED);
//        }
//
//        // 연동된 계좌 목록 조회
//        List<AccountForMydataResponse> accounts = mydataConnectService.getAccounts(userId.value(), mydataToken);
//
//        return ResponseEntity.ok()
//                .body(ApiResponse.success("연동된 계좌 목록 조회 성공", accounts));
//    }
}
