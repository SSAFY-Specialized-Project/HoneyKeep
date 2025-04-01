package com.barcode.honeykeep.mydataConnect.service;

import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.external.BankApiClient;
import com.barcode.honeykeep.common.external.dto.ConnectableBankDto;
import com.barcode.honeykeep.mydataConnect.dto.*;
import com.barcode.honeykeep.mydataConnect.entity.LinkedInstitution;
import com.barcode.honeykeep.mydataConnect.entity.UserBankToken;
import com.barcode.honeykeep.mydataConnect.exception.MydataErrorCode;
import com.barcode.honeykeep.mydataConnect.repository.BankForMydataRepository;
import com.barcode.honeykeep.mydataConnect.repository.LinkedInstitutionRepository;
import com.barcode.honeykeep.mydataConnect.repository.UserBankTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserRepository userRepository;
    private final BankForMydataRepository bankForMydataRepository;
    private final AccountRepository accountForMydataRepository;

    public List<BankListForMydataResponse> getBankListWithStatus(Long userId) {
        List<ConnectableBankDto> banks = bankApiClient.getBankCodes();
        System.out.println("--------------------------------" + banks.size());

        Set<String> linkedCodes = linkedInstitutionRepository.findByUserId(userId).stream()
                .map(LinkedInstitution::getBankCode)
                .collect(Collectors.toSet());

        return banks.stream()
                .map(toBankListResponse(linkedCodes))
                .toList();
    }

    private Function<ConnectableBankDto, BankListForMydataResponse> toBankListResponse(Set<String> linkedCodes) {
        return bank -> mapToBankListResponse(bank, linkedCodes);
    }

    private BankListForMydataResponse mapToBankListResponse(ConnectableBankDto bank, Set<String> linkedCodes) {
        return BankListForMydataResponse.builder()
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
    public List<AccountForMydataResponse> getAccounts(Long userId, String accessToken) {
        UserBankToken token = userBankTokenRepository.findByUserIdAndAccessToken(userId, accessToken)
                .orElseThrow(() -> new CustomException(MydataErrorCode.TOKEN_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        List<AccountForMydataDto> allAccounts = bankApiClient.getAccounts(user.getUserKey());
        return allAccounts.stream()
                .filter(a -> a.bankCode().equals(token.getBankCode()))
                .map(this::mapToAccountResponse)
                .toList();
    }

    private AccountForMydataResponse mapToAccountResponse(AccountForMydataDto dto) {
        return AccountForMydataResponse.builder()
                .accountNumber(dto.accountNo())
                .bankName(dto.bankName())
                .balance(Long.parseLong(dto.accountBalance()))
                .build();
    }

    @Transactional(readOnly = true)
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

