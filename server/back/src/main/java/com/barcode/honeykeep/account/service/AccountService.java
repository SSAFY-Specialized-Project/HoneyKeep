package com.barcode.honeykeep.account.service;

import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
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

    //TODO: 계좌 존재하는지 확인
    //TODO: 계좌 소유자 검증
    public AccountDetailResponse getAccountDetailById(Long id, Long userId) {
        // 개선: 새로 추가된 메서드 활용
        Account account = getAccountById(id);
        validateAccountOwner(id, userId);

        return AccountDetailResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountBalance(account.getAccountBalance().getAmount())
                .bankName(account.getBank().getName())
                .accountName(account.getAccountName())
                .build();
    }

    /**
     * ID로 계좌 조회
     */
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 계좌를 찾을 수 없습니다: " + accountId));
    }

    /**
     * 계좌 소유자 검증
     */
    public void validateAccountOwner(Long accountId, Long userId) {
        Account account = getAccountById(accountId);
        if (!account.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("계좌에 대한 권한이 없습니다.");
        }
    }
}