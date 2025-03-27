package com.barcode.honeykeep.account.service;

import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepsository) {
        this.accountRepository = accountRepsository;
    }

    //TODO: 포켓 정보 추가
    public List<AccountResponse> getAccountsByUserId(Long userId) {
        List<Account> accounts = accountRepository.findByUser_Id(userId);

        return accounts.stream().map(account -> {
            return AccountResponse.builder()
                    .accountNumber(account.getAccountNumber())
                    .accountBalance(account.getAccountBalance().getAmount())
                    .accountName(account.getAccountName())
                    .bankName(account.getBank().getName())
                    .build();
        }).collect(Collectors.toList());
     }

    // 계좌 상세 조회 (계좌 ID로 조회)
    public AccountDetailResponse getAccountDetailById(Long id, Long userId) {

        //해당 Id의 계좌 없으면 예외 던짐
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        //계좌 소유자 검증
        if(!account.getUser().getId().equals(userId)) {
            throw new CustomException(AccountErrorCode.ACCOUNT_ACCESS_DENIED);
        }

        return AccountDetailResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountBalance(account.getAccountBalance().getAmount())
                .bankName(account.getBank().getName())
                .accountName(account.getAccountName())
                .build();

     }
}
