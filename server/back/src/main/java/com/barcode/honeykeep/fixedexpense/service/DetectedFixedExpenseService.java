package com.barcode.honeykeep.fixedexpense.service;

import java.util.Comparator;
import java.util.List;

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

    public List<DetectedFixedExpenseResponse> getAllDetectedFixedExpenses(Long userId) {
        List<DetectedFixedExpense> detectedFixedExpenses = detectedFixedExpenseRepository.findByUser_IdAndStatus(userId, DetectionStatus.DETECTED);

        return detectedFixedExpenses.stream()
                .sorted(Comparator.comparing(DetectedFixedExpense::getDetectionScore).reversed())
                .map(d -> DetectedFixedExpenseResponse.builder()
                        .id(d.getId())
                        .account(d.getAccount())
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

        detectedFixedExpense.update(
                request.account(),
                request.name(),
                request.averageAmount(),
                request.averageDay()
        );

        return DetectedFixedExpenseResponse.builder()
                .id(detectedFixedExpense.getId())
                .account(detectedFixedExpense.getAccount())
                .name(detectedFixedExpense.getName())
                .averageAmount(detectedFixedExpense.getAverageAmount().toString())
                .averageDay(detectedFixedExpense.getAverageDay())
                .transactionCount(detectedFixedExpense.getTransactionCount())
                .build();
    }

    @Transactional
    public void deleteDetectedFixedExpense(Long userId, Long id) {
        DetectedFixedExpense detectedFixedExpense = detectedFixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!detectedFixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        /**
         * is_deleted = true로 변경
         * 이후 더티 체킹 -> 업데이트 됨.
         */
        detectedFixedExpense.delete("");
    }

}
