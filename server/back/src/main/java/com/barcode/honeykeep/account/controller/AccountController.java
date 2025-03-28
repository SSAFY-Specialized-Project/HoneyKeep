package com.barcode.honeykeep.account.controller;

import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.dto.TransferValidationRequest;
import com.barcode.honeykeep.account.dto.TransferValidationResponse;
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
        return ResponseEntity.ok().body(ApiResponse.success(accountResponseList));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountDetailResponse>> getAccountDetails(@PathVariable("id") Long id,
                                                          @AuthenticationPrincipal UserId userId) {
        AccountDetailResponse accountDetailResponse = accountService.getAccountDetailById(id, userId.value());
        return ResponseEntity.ok().body(ApiResponse.success(accountDetailResponse));
    }

    //TODO: 돈 보내기 눌렀을 때, 나의 계좌 목록들 응답하는 API 추가


     //검증 단계 API
     //사용자가 이체를 진행하기 전에 출금 계좌와 입금 계좌 정보를 검증하고, 양쪽 계좌의 정보를 응답한다.
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<TransferValidationResponse>> validateTransfer(
            @AuthenticationPrincipal UserId userId,
            @RequestBody TransferValidationRequest request) {
        TransferValidationResponse response = accountService.validateTransfer(request, userId.value());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}