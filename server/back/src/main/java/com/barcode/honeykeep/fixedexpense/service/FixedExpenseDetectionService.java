package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.auth.service.AuthService;
import com.barcode.honeykeep.fixedexpense.repository.DetectedFixedExpenseRepository;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * DetectedFixedExpenseService 와 다르게, 이 서비스 클래스는 고정지출을 감지하는 배치 작업만을 처리함.
 */
@Service
@RequiredArgsConstructor
public class FixedExpenseDetectionService {
    private final TransactionRepository transactionRepository;
    private final DetectedFixedExpenseRepository detectedFixedExpenseRepository;
    private final UserService userService;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void detectMonthlyFixedExpenses() {
        // 거래내역 분석 및 고정지출 감지
        List<Long> userIds = userService.getAllUserIds();
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);

        // 사용자 ID -> (계좌 ID -> 거래내역 목록) 맵 구조
        Map<Long, Map<Long, List<Transaction>>> userAccountTransactions = new HashMap<>();

        for (Long userId : userIds) {
            // 사용자의 모든 거래내역 조회
            List<Transaction> transactions = transactionRepository.findByAccount_User_IdAndDateAfter(userId, sixMonthsAgo);

            // 계좌 ID별로 거래내역 그룹화
            Map<Long, List<Transaction>> accountTransactions = transactions.stream()
                    .collect(Collectors.groupingBy(
                            transaction -> transaction.getAccount().getId()  // 계좌 ID로 그룹화
                    ));

            // 사용자별 맵에 추가
            userAccountTransactions.put(userId, accountTransactions);
        }


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