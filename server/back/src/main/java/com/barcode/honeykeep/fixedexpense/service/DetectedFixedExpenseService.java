package com.barcode.honeykeep.fixedexpense.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import com.barcode.honeykeep.account.dto.AccountSummaryDto;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
import com.barcode.honeykeep.fixedexpense.repository.FixedExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.fixedexpense.dto.DetectedFixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.dto.DetectedFixedExpenseUpdateRequest;
import com.barcode.honeykeep.fixedexpense.entity.DetectedFixedExpense;
import com.barcode.honeykeep.fixedexpense.exception.FixedExpenseErrorCode;
import com.barcode.honeykeep.fixedexpense.repository.DetectedFixedExpenseRepository;
import com.barcode.honeykeep.fixedexpense.type.DetectionStatus;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DetectedFixedExpenseService {

    private final DetectedFixedExpenseRepository detectedFixedExpenseRepository;
    private final FixedExpenseRepository fixedExpenseRepository;
    private final AccountRepository accountRepository;

    public List<DetectedFixedExpenseResponse> getAllDetectedFixedExpenses(Long userId) {
        List<DetectedFixedExpense> detectedFixedExpenses = detectedFixedExpenseRepository.findByUser_IdAndStatus(userId, DetectionStatus.DETECTED);

        return detectedFixedExpenses.stream()
                .sorted(Comparator.comparing(DetectedFixedExpense::getDetectionScore).reversed())
                .map(d -> DetectedFixedExpenseResponse.builder()
                        .id(d.getId())
                        .account(new AccountSummaryDto(
                                d.getAccount().getBank().getName(),
                                d.getAccount().getAccountName(),
                                d.getAccount().getAccountNumber()
                        ))
                        .name(d.getName())
                        .averageAmount(d.getAverageAmount().toString())
                        .averageDay(d.getAverageDay())
                        .transactionCount(d.getTransactionCount())
                        .build()
                )
                .toList();
    }

    @Transactional
    public DetectedFixedExpenseResponse updateDetectedFixedExpense(Long userId, Long id, DetectedFixedExpenseUpdateRequest request) {
        DetectedFixedExpense detectedFixedExpense = detectedFixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!detectedFixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        Account account = accountRepository.findByAccountNumber(request.accountNumber())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        detectedFixedExpense.update(
                account,
                request.name(),
                request.name(),
                request.averageAmount(),
                request.averageDay()
        );

        return DetectedFixedExpenseResponse.builder()
                .id(detectedFixedExpense.getId())
                .account(new AccountSummaryDto(
                        detectedFixedExpense.getAccount().getBank().getName(),
                        detectedFixedExpense.getAccount().getAccountName(),
                        detectedFixedExpense.getAccount().getAccountNumber()
                ))
                .name(detectedFixedExpense.getName())
                .averageAmount(detectedFixedExpense.getAverageAmount().toString())
                .averageDay(detectedFixedExpense.getAverageDay())
                .transactionCount(detectedFixedExpense.getTransactionCount())
                .build();
    }

    @Transactional
    public void rejectDetectedFixedExpense(Long userId, Long id) {
        DetectedFixedExpense detectedFixedExpense = detectedFixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!detectedFixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        // 더티체킹
        detectedFixedExpense.reject();
    }

    @Transactional
    public FixedExpenseResponse approveDetectedFixedExpense(Long userId, Long id, FixedExpenseRequest request) {
        DetectedFixedExpense detectedFixedExpense = detectedFixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!detectedFixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        // 더티체킹
        detectedFixedExpense.approve();

        Account account = accountRepository.findByAccountNumber(request.accountNumber())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));
        User user = detectedFixedExpense.getUser();

        FixedExpense fixedExpense = FixedExpense.builder()
                .account(account)
                .user(user)
                .name(request.name())
                .money(request.money())
                .startDate(request.startDate())
                .payDay(request.payDay())
                .transactionCount(detectedFixedExpense.getTransactionCount())
                .memo("자동 감지된 고정지출에서 승인됨")
                .build();

        FixedExpense saved = fixedExpenseRepository.save(fixedExpense);

        // 고정지출로 저장
        return new FixedExpenseResponse(
                saved.getId(),
                new AccountSummaryDto(
                        account.getBank().getName(),
                        account.getAccountName(),
                        account.getAccountNumber()
                ),
                saved.getName(),
                saved.getMoney(),
                saved.getStartDate(),
                saved.getPayDay(),
                saved.getTransactionCount(),
                saved.getMemo()
        );
    }

}
