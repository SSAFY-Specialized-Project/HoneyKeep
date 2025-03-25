package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.fixedexpense.repository.DetectedFixedExpenseRepository;
import com.barcode.honeykeep.transaction.entity.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FixedExpenseDetectionService {
//    private final TransactionRepository transactionRepository;
    private final DetectedFixedExpenseRepository detectedFixedExpenseRepository;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void detectMonthlyFixedExpenses() {
        // 거래내역 분석 및 고정지출 감지
    }

    private double calculateMerchantScore(List<Transaction> transactions) {
        // 가맹점 일치 점수 계산 (0.3)
        return 0.0;
    }

    private double calculateAmountScore(List<Transaction> transactions) {
        // 금액 일관성 점수 계산 (0.2)
        return 0.0;
    }

    private double calculateDateScore(List<Transaction> transactions) {
        // 날짜 일관성 점수 계산 (0.2)
        System.out.println();
        return 0.0;
    }

    private double calculatePersistenceScore(List<Transaction> transactions) {
        // 거래 지속성 점수 계산 (0.3)
        return 0.0;
    }
}