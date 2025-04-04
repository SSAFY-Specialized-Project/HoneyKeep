package com.barcode.honeykeep.account.controller;

import com.barcode.honeykeep.account.dto.*;
import com.barcode.honeykeep.account.service.AccountService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    //나의 계좌 목록 조회
    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getMyAccounts(@AuthenticationPrincipal UserId userId) {
        List<AccountResponse> accountResponseList = accountService.getAccountsByUserId(userId.value());
        return  (accountResponseList == null || accountResponseList.isEmpty())
                ? ResponseEntity.ok().body(ApiResponse.noContent("계좌가 존재하지 않습니다.", null))
                : ResponseEntity.ok().body(ApiResponse.success(accountResponseList));
    }

    //계좌 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> getAccountDetails(@PathVariable("id") Long id,
                                                          @AuthenticationPrincipal UserId userId) {
        AccountDetailResponse accountDetailResponse = accountService.getAccountDetailById(id, userId.value());
        return  accountDetailResponse == null
                ? ResponseEntity.ok().body(ApiResponse.noContent("계좌가 존재하지 않습니다.", null))
                : ResponseEntity.ok().body(ApiResponse.success(accountDetailResponse));
    }


     //검증 단계 API
     //사용자가 이체를 진행하기 전에 출금 계좌와 입금 계좌 정보를 검증하고, 양쪽 계좌의 정보를 응답한다.
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<TransferValidationResponse>> validateTransfer(
            @AuthenticationPrincipal UserId userId,
            @RequestBody TransferValidationRequest request) {
        TransferValidationResponse response = accountService.validateTransfer(request, userId.value());
        return ResponseEntity.ok(ApiResponse.success(response));
    }


    @PostMapping("/execute")
    public ResponseEntity<ApiResponse<TransferExecutionResponse>> executeTransfer(
            @AuthenticationPrincipal UserId userId,
            @RequestBody TransferExecutionRequest request
    ){
        TransferExecutionResponse response = accountService.executeTransfer(request, userId.value());
        return ResponseEntity.ok(ApiResponse.success(response));
    }



}