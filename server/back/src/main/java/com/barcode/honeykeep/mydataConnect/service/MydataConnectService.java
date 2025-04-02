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
        String userKey = user.getUserKey();

        List<AccountForMydataDto> accounts = bankApiClient.getAccounts(userKey);
        List<Account> toSaveAccounts = new ArrayList<>();

        for (String code : bankCodes) {
            Bank bank = bankRepository.findByCode(code)
                    .orElseThrow(() -> new CustomException(MydataErrorCode.BANK_NOT_FOUND));

            List<AccountForMydataDto> accountsFilteredByBank = accounts.stream()
                    .filter(a -> a.bankCode().equals(code))
                    .toList();

            for (AccountForMydataDto a : accountsFilteredByBank) {
                if (accountRepository.existsAccountByAccountNumber(a.accountNo())) continue;

                Account account = Account.builder()
                        .user(user)
                        .bank(bank)
                        .accountName(a.accountName())
                        .accountNumber(a.accountNo())
                        .accountExpiryDate(a.accountExpiryDateAsLocalDate())
                        .accountBalance(a.accountBalanceAsMoney())
                        .dailyTransferLimit(a.dailyTransferLimitAsMoney())
                        .oneTimeTransferLimit(a.oneTimeTransferLimitAsMoney())
                        .lastTransactionDate(a.lastTransactionDateAsLocalDate())
                        .build();

                toSaveAccounts.add(account);
            }
        }

        toSaveAccounts = accountRepository.saveAll(toSaveAccounts);

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

