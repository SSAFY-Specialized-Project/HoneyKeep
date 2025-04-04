package com.barcode.honeykeep.mydataConnect.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.barcode.honeykeep.mydataConnect.dto.*;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.entity.Bank;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.external.BankApiClient;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.mydataConnect.exception.MydataErrorCode;
import com.barcode.honeykeep.mydataConnect.repository.BankRepository;
import com.barcode.honeykeep.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MydataConnectService {

    private final BankApiClient bankApiClient;
    private final UserRepository userRepository;
    private final BankRepository bankRepository;
    private final AccountRepository accountRepository;

    public List<BankListForMydataResponse> getBankListWithStatus(Long userId) {
        // 사용자 계좌 조회 -> 계좌가 존재하는 은행 추리기
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));
        String userKey = user.getUserKey();

        List<AccountForMydataDto> accounts = bankApiClient.getAccounts(userKey);

        return accounts.stream()
                .map(a -> new BankListForMydataResponse(
                        a.bankCode(),
                        a.bankName(),
                        false
                ))
                .collect(Collectors.toSet())
                .stream()
                .toList();
    }

    @Transactional
    public void connect(Long userId, List<String> bankCodes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

        List<AccountForMydataDto> accounts = bankApiClient.getAccounts(user.getUserKey());

        // 선택된 은행 코드와 일치하는 계좌만 필터링한 후 엔티티로 변환한다.
        List<Account> newAccounts = accounts.stream()
                .filter(account -> bankCodes.contains(account.bankCode())) // 선택된 은행만 필터링
                .filter(account -> !accountRepository.existsAccountByAccountNumber(account.accountNo())) // 기존 계좌 제외
                .map(account -> {
                    Bank bank = bankRepository.findByCode(account.bankCode())
                            .orElseThrow(() -> new CustomException(MydataErrorCode.BANK_NOT_FOUND));

                    return Account.builder()
                            .user(user)
                            .bank(bank)
                            .accountName(account.accountName())
                            .accountNumber(account.accountNo())
                            .accountExpiryDate(account.accountExpiryDateAsLocalDate())
                            .accountBalance(account.accountBalanceAsMoney())
                            .dailyTransferLimit(account.dailyTransferLimitAsMoney())
                            .oneTimeTransferLimit(account.oneTimeTransferLimitAsMoney())
                            .lastTransactionDate(account.lastTransactionDateAsLocalDate())
                            .build();
                })
                .toList();

        // 저장
        accountRepository.saveAll(newAccounts);

        // TODO: 연동 결과 뭐주지??
    }

    @Transactional
    public BankAuthForMydataResponse requestAccountAuth(Long userId, String accountNo) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        return bankApiClient.requestAccountAuth(user.getUserKey(), accountNo);
    }

    @Transactional
    public void verifyAccountAuth(Long userId, AccountVerifyForMydataRequest request) {
        // 인증번호 검증
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        Map<String, Object> result = bankApiClient.verifyAccountAuthCode(
                user.getUserKey(), request.accountNo(), request.authCode());

        String status = (String) result.get("status");
        if (!"SUCCESS".equals(status)) {
            throw new CustomException(MydataErrorCode.ACCOUNT_AUTH_FAILED);
        }

        // 계좌 단건 조회
        AccountForMydataDto dto = bankApiClient.getAccount(user.getUserKey(), request.accountNo());
        Bank bankForMydata = bankRepository.findById(dto.bankCode())
                .orElseThrow(() -> new CustomException(MydataErrorCode.BANK_NOT_FOUND));

        // 연동한 계좌 저장
        Account accountForMydata = Account.builder()
                .user(user)
                .bank(bankForMydata)
                .accountName(dto.accountName())
                .accountNumber(dto.accountNo())
                .accountExpiryDate(LocalDate.parse(dto.accountExpiryDate(),
                        DateTimeFormatter.ofPattern("yyyyMMdd")))
                .accountBalance(new Money(new BigDecimal(dto.accountBalance())))
                .dailyTransferLimit(new Money(new BigDecimal(dto.dailyTransferLimit())))
                .oneTimeTransferLimit(new Money(new BigDecimal(dto.oneTimeTransferLimit())))
                .lastTransactionDate(parseNullableDate(dto.lastTransactionDate()))
                .build();

        accountRepository.save(accountForMydata);
    }


    public TransactionHistoryResponse inquireTransactionHistory(Long userId, TransactionHistoryRequest request) {
        // 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        // 외부 API 호출 (BankApiClient)
        Map<String, Object> rec = bankApiClient.getTransactionHistory(
                user.getUserKey(),
                request.accountNo(),
                request.transactionUniqueNo()
        );

        // 응답 매핑
        return new TransactionHistoryResponse(
                (String) rec.get("transactionUniqueNo"),
                (String) rec.get("transactionDate"),
                (String) rec.get("transactionTime"),
                (String) rec.get("transactionType"),
                (String) rec.get("transactionTypeName"),
                (String) rec.get("transactionAccountNo"),
                (String) rec.get("transactionBalance"),
                (String) rec.get("transactionAfterBalance"),
                (String) rec.get("transactionSummary"),
                (String) rec.get("transactionMemo")
        );
    }


    private LocalDate parseNullableDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

}

