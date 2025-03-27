package com.barcode.honeykeep.mydataConnect.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.mydataConnect.dto.*;
import com.barcode.honeykeep.mydataConnect.service.MydataConnectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/mydata")
@RequiredArgsConstructor
public class MydataConnectController {

    private final MydataConnectService mydataConnectService;

    /**
     * 
     * 마이데이터 연동 가능한 은행 목록 조회 API
     */
    @GetMapping("/banks")
    public ResponseEntity<ApiResponse<List<BankListForMydataResponse>>> getAvailableBanks(@AuthenticationPrincipal UserId userId) {
        List<BankListForMydataResponse> bankList = mydataConnectService.getBankListWithStatus(userId.value());
        return ResponseEntity.ok(ApiResponse.success("은행 목록 조회 성공", bankList));
    }

    /**
     * 
     * 마이데이터 연동 요청 API
     */
    @PostMapping("/connect")
    public ResponseEntity<ApiResponse<String>> connectInstitution(@AuthenticationPrincipal UserId userId,
                                                                @RequestBody BankConnectForMydataRequest request) {
        String token = mydataConnectService.connectInstitution(userId.value(), request.bankCode());
        return ResponseEntity.ok(ApiResponse.success("기관 연동 요청 성공", token));
    }

    /**
     * 
     * 선택한 은행에서 연동할 수 있는 계좌 목록 요청 API
     */
    @GetMapping("/accounts")
    public ResponseEntity<ApiResponse<List<AccountForMydataResponse>>> getAccounts(
            @AuthenticationPrincipal UserId userId,
            @RequestHeader("Mydata-Access-Token") String mydataToken) {
        List<AccountForMydataResponse> accounts = mydataConnectService.getAccounts(userId.value(), mydataToken);
        return ResponseEntity.ok(ApiResponse.success("계좌 목록 조회 성공", accounts));
    }

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
     */
    @PostMapping("/accounts/verify")
    public ResponseEntity<ApiResponse<Void>> verifyAccountAuth(
            @AuthenticationPrincipal UserId userId,
            @RequestBody AccountVerifyForMydataRequest request) {

        mydataConnectService.verifyAccountAuth(userId.value(), request);
        return ResponseEntity.ok(ApiResponse.success("계좌 인증 및 저장 성공", null));
    }




}
