package com.barcode.honeykeep.mydataConnect.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.external.BankApiClient;
import com.barcode.honeykeep.common.external.dto.ConnectableBankDto;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.mydataConnect.dto.*;
import com.barcode.honeykeep.mydataConnect.entity.Account;
import com.barcode.honeykeep.mydataConnect.entity.Bank;
import com.barcode.honeykeep.mydataConnect.entity.LinkedInstitution;
import com.barcode.honeykeep.mydataConnect.entity.UserBankToken;
import com.barcode.honeykeep.mydataConnect.exception.MydataErrorCode;
import com.barcode.honeykeep.mydataConnect.repository.AccountRepository;
import com.barcode.honeykeep.mydataConnect.repository.BankRepository;
import com.barcode.honeykeep.mydataConnect.repository.LinkedInstitutionRepository;
import com.barcode.honeykeep.mydataConnect.repository.UserBankTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MydataConnectService {

    private final BankApiClient bankApiClient;
    private final LinkedInstitutionRepository linkedInstitutionRepository;
    private final UserBankTokenRepository userBankTokenRepository;
    private final AuthRepository authRepository;
    private final BankRepository bankRepository;
    private final AccountRepository accountRepository;

    public List<BankListResponse> getBankListWithStatus(Long userId) {
        List<ConnectableBankDto> banks = bankApiClient.getBankCodes();

        Set<String> linkedCodes = linkedInstitutionRepository.findByUserId(userId).stream()
                .map(LinkedInstitution::getBankCode)
                .collect(Collectors.toSet());

        return banks.stream()
                .map(toBankListResponse(linkedCodes))
                .toList();
    }

    private Function<ConnectableBankDto, BankListResponse> toBankListResponse(Set<String> linkedCodes) {
        return bank -> mapToBankListResponse(bank, linkedCodes);
    }

    private BankListResponse mapToBankListResponse(ConnectableBankDto bank, Set<String> linkedCodes) {
        return BankListResponse.builder()
                .bankCode(bank.bankCode())
                .bankName(bank.bankName())
                .isLinked(linkedCodes.contains(bank.bankCode()))
                .build();
    }

    @Transactional
    public String connectInstitution(Long userId, String bankCode) {
        String accessToken = UUID.randomUUID().toString();          // 연동 토큰 생성
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(1); // 1시간 유효

        UserBankToken token = UserBankToken.builder()
                .userId(userId)
                .bankCode(bankCode)
                .accessToken(accessToken)
                .expiresAt(expiresAt)
                .build();

        userBankTokenRepository.save(token);
        return accessToken;
    }

    // todo : userKey를 db 말고 @AuthenticationPrincipal에서 받아오도록 변경
    public List<AccountResponse> getAccounts(Long userId, String accessToken) {
        UserBankToken token = userBankTokenRepository.findByUserIdAndAccessToken(userId, accessToken)
                .orElseThrow(() -> new CustomException(MydataErrorCode.TOKEN_NOT_FOUND));

        User user = authRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        List<AccountDto> allAccounts = bankApiClient.getAccounts(user.getUserKey());
        return allAccounts.stream()
                .filter(a -> a.bankCode().equals(token.getBankCode()))
                .map(this::mapToAccountResponse)
                .toList();
    }

    private AccountResponse mapToAccountResponse(AccountDto dto) {
        return AccountResponse.builder()
                .accountNumber(dto.accountNo())
                .bankName(dto.bankName())
                .balance(Long.parseLong(dto.accountBalance()))
                .build();
    }

    @Transactional
    public BankAuthResponse requestAccountAuth(Long userId, String accountNo) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        return bankApiClient.requestAccountAuth(user.getUserKey(), accountNo);
    }

    @Transactional
    public void verifyAccountAuth(Long userId, AccountVerifyRequest request) {
        // 인증번호 검증
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        Map<String, Object> result = bankApiClient.verifyAccountAuthCode(
                user.getUserKey(), request.accountNo(), request.authCode());

        String status = (String) result.get("status");
        if (!"SUCCESS".equals(status)) {
            throw new CustomException(MydataErrorCode.ACCOUNT_AUTH_FAILED);
        }

        // 계좌 단건 조회
        AccountDto dto = bankApiClient.getAccount(user.getUserKey(), request.accountNo());
        Bank bank = bankRepository.findById(dto.bankCode())
                .orElseThrow(() -> new CustomException(MydataErrorCode.BANK_NOT_FOUND));

        // 연동한 계좌 저장
        Account account = Account.builder()
                .user(user)
                .bank(bank)
                .accountName(dto.accountName())
                .accountNumber(dto.accountNo())
                .accountExpiryDate(LocalDate.parse(dto.accountExpiryDate(),
                        DateTimeFormatter.ofPattern("yyyyMMdd")))
                .accountBalance(new Money(new BigDecimal(dto.accountBalance())))
                .dailyTransferLimit(new Money(new BigDecimal(dto.dailyTransferLimit())))
                .oneTimeTransferLimit(new Money(new BigDecimal(dto.oneTimeTransferLimit())))
                .lastTransactionDate(parseNullableDate(dto.lastTransactionDate()))
                .build();

        accountRepository.save(account);
    }

    private LocalDate parseNullableDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        return LocalDate.parse(dateStr, DateTimeFormatter.ofPattern("yyyyMMdd"));
    }

}

