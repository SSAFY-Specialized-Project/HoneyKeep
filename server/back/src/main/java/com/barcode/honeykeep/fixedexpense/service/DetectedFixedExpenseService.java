package com.barcode.honeykeep.fixedexpense.service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
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
    private final AccountRepository accountRepository;
    private final FixedExpenseService fixedExpenseService;

    public List<DetectedFixedExpenseResponse> getAllDetectedFixedExpenses(Long userId) {
        List<DetectedFixedExpense> detectedFixedExpenses = detectedFixedExpenseRepository.findByUser_IdAndStatus(userId, DetectionStatus.DETECTED);

        return detectedFixedExpenses.stream()
                .sorted(Comparator.comparing(DetectedFixedExpense::getDetectionScore).reversed())
                .map(d -> DetectedFixedExpenseResponse.builder()
                        .id(d.getId())
                        .bankName(d.getAccount().getBank().getName())
                        .accountName(d.getAccount().getAccountName())
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
                .bankName(detectedFixedExpense.getAccount().getBank().getName())
                .accountName(detectedFixedExpense.getAccount().getAccountName())
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
    public FixedExpenseResponse approveDetectedFixedExpense(Long userId, Long id) {
        DetectedFixedExpense detectedFixedExpense = detectedFixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!detectedFixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        // 더티체킹
        detectedFixedExpense.approve();

        // 날짜 계산 - 매월 averageDay 일에 지불하는 것으로
        LocalDate today = LocalDate.now();
        LocalDate payDay = today.withDayOfMonth(Math.min(detectedFixedExpense.getAverageDay(), today.lengthOfMonth()));

        // 시작일 계산 - lastTransactionDate에서 거꾸로 계산하여 첫 발생일 추정
        // 현실적으로 첫 발생일 정확한 계산은 어렵다.
        LocalDate startDate;
        if (detectedFixedExpense.getLastTransactionDate() != null) {
            // 있는 날짜 중 가장 오래된 거래 날짜 사용
            startDate = detectedFixedExpense.getLastTransactionDate().minusMonths(
                    detectedFixedExpense.getTransactionCount() - 1L);
        } else {
            // 정보가 없으면 6개월 전으로 추정 (데이터 수집 기간 기준)
            startDate = today.minusMonths(6);
        }

        // 시작일에 실제 평균 지불일자 반영
        startDate = startDate.withDayOfMonth(Math.min(detectedFixedExpense.getAverageDay(), startDate.lengthOfMonth()));

        FixedExpenseRequest request = new FixedExpenseRequest(
                detectedFixedExpense.getAccount().getAccountNumber(),
                detectedFixedExpense.getName(),
                detectedFixedExpense.getAverageAmount(),
                startDate,  // 추정된 시작일
                payDay,     // 평균 지불일
                "자동 감지된 고정지출에서 승인됨"
        );

        // 고정지출로 저장
        return fixedExpenseService.createFixedExpenses(userId, request);
    }

}
