package com.barcode.honeykeep.account.controller;

import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.service.AccountService;
import com.barcode.honeykeep.common.vo.UserId;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<List<AccountResponse>> getMyAccounts(@AuthenticationPrincipal UserId userId) {
        List<AccountResponse> accountResponseList = accountService.getAccountsByUserId(userId.value());
        return ResponseEntity.ok(accountResponseList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountDetailResponse> getAccountDetails(@PathVariable("id") Long id,
                                                          @AuthenticationPrincipal UserId userId) {
        AccountDetailResponse accountDetailResponse = accountService.getAccountDetailById(id, userId.value());
        return ResponseEntity.ok(accountDetailResponse);
    }


}