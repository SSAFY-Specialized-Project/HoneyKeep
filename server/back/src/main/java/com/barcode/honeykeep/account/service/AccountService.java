package com.barcode.honeykeep.account.service;

import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepsository) {
        this.accountRepository = accountRepsository;
    }

    //TODO: 포켓 정보 추가
    //TODO: Exception 추가
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

    public AccountDetailResponse getAccountDetailById(Long id, Long userId) {
        Optional<Account> optionalAccount = accountRepository.findById(id);

        //TODO: 계좌 존재하는지 확인
        Account account = optionalAccount.get();

        //TODO: 계좌 소유자 검증
        if(!account.getUser().getId().equals(userId)) {
            System.out.println(userId+" 유저의 계좌가 아닙니다.");
        }

        return AccountDetailResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountBalance(account.getAccountBalance().getAmount())
                .bankName(account.getBank().getName())
                .accountName(account.getAccountName())
                .build();

     }
}
