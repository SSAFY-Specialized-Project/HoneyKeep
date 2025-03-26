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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    private Map<Long, Map<Long, List<Transaction>>> userAccountTransactions;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void detectMonthlyFixedExpenses() {
        // 가져오기
        getUserAccountTransactions();

        /**
         * 점수 계산 로직이다.
         */
        for (Map.Entry<Long, Map<Long, List<Transaction>>> userEntry : userAccountTransactions.entrySet()) {
            Long userId = userEntry.getKey();
            Map<Long, List<Transaction>> accountTransactions = userEntry.getValue();

            for (Map.Entry<Long, List<Transaction>> accountEntry : accountTransactions.entrySet()) {
                Long accountId = accountEntry.getKey();
                List<Transaction> transactions = accountEntry.getValue();

                // 가맹점별로 그룹화하여 분석
                analyzeMerchantTransactions(userId, accountId, transactions);
            }
        }
    }

    /**
     * 각 유저들의 모든 계좌에 해당하는 거래내역들을 조회 및 저장
     */
    private void getUserAccountTransactions(){
        List<Long> userIds = userService.getAllUserIds();
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        userAccountTransactions = new HashMap<>();

        for (Long userId : userIds) {
            List<Transaction> transactions = transactionRepository.findByAccount_User_IdAndDateAfter(userId, sixMonthsAgo);

            Map<Long, List<Transaction>> accountTransactions = transactions.stream()
                    .collect(Collectors.groupingBy(
                            transaction -> transaction.getAccount().getId()  // 계좌 ID로 그룹화
                    ));

            userAccountTransactions.put(userId, accountTransactions);
        }
    }

    private void analyzeMerchantTransactions(Long userId, Long accountId, List<Transaction> transactions) {
        // 가맹점별로 거래 그룹화
        Map<String, List<Transaction>> merchantTransactions = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getName));

        // 각 가맹점별로 고정지출 여부 판단
        for (Map.Entry<String, List<Transaction>> entry : merchantTransactions.entrySet()) {
            String merchantName = entry.getKey();
            List<Transaction> merchantTxs = entry.getValue();

            // 최소 3회 이상 거래가 있어야 분석
            if (merchantTxs.size() < 3) continue;

            // 점수 계산
            double merchantScore = calculateMerchantScore(merchantTxs);
            double amountScore = calculateAmountScore(merchantTxs);
            double dateScore = calculateDateScore(merchantTxs);
            double persistenceScore = calculatePersistenceScore(merchantTxs);

            // 종합 점수
            double totalScore = merchantScore + amountScore + dateScore + persistenceScore;

            // 일정 점수 이상이면 고정지출로 감지
            if (totalScore >= 0.6) {
                createDetectedFixedExpense(
                        userId,
                        accountId,
                        merchantName,
                        merchantTxs,
                        merchantScore,
                        amountScore,
                        dateScore,
                        persistenceScore,
                        totalScore
                );
            }
        }
    }

    private void createDetectedFixedExpense(Long userId, Long accountId, String merchantName,
                                            List<Transaction> transactions, double merchantScore,
                                            double amountScore, double dateScore, double persistenceScore,
                                            double totalScore) {
        //TODO:
        // 기존 감지된 고정지출이 있는지 확인
        // 평균 금액, 평균 발생일, 최근 거래일 등 계산
        // DetectedFixedExpense 엔티티 생성 및 저장
    }

    private double calculateMerchantScore(List<Transaction> transactions) {
        // 같은 가맹점(거래처)에서 반복적으로 발생하는 거래 패턴 분석
        Map<String, Long> merchantCounts = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getName, Collectors.counting()));

        // 가장 빈도가 높은 가맹점 찾기
        Optional<Long> maxCount = merchantCounts.values()
                .stream()
                .max(Long::compareTo);

        if (maxCount.isEmpty() || transactions.isEmpty()) return 0.0;

        // 가맹점 일치 점수 = 최다 발생 가맹점 거래 수 / 전체 거래 수
        return (double) maxCount.get() / transactions.size() * 0.3;
    }

    private double calculateAmountScore(List<Transaction> transactions) {
        // 거래 금액의 일관성 분석
        if (transactions.isEmpty()) return 0.0;

        // 모든 거래 금액 추출
        List<BigDecimal> amounts = transactions.stream()
                .map(t -> t.getAmount().getAmount())
                .toList();

        // 평균 금액 계산
        BigDecimal avgAmount = amounts.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(amounts.size()), 2, RoundingMode.HALF_UP);

        // 표준편차 계산
        double variance = amounts.stream()
                .map(amount -> amount.subtract(avgAmount).pow(2))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(amounts.size()), 2, RoundingMode.HALF_UP)
                .doubleValue();
        double stdDev = Math.sqrt(variance);

        // 변동계수(CV) = 표준편차 / 평균
        double cv = stdDev / avgAmount.doubleValue();

        // 금액 일관성 점수 (CV가 낮을수록 일관성이 높음)
        return Math.max(0, (1 - Math.min(cv, 1))) * 0.2;
    }

    private double calculateDateScore(List<Transaction> transactions) {
        // 거래 날짜의 일관성 분석
        if (transactions.size() < 2) return 0.0;

        // 거래일자 추출 및 정렬
        List<LocalDate> dates = transactions.stream()
                .map(t -> t.getDate().toLocalDate())
                .sorted()
                .collect(Collectors.toList());

        // 각 거래일의 일(day) 추출
        List<Integer> days = dates.stream()
                .map(LocalDate::getDayOfMonth)
                .collect(Collectors.toList());

        // 일(day)별 발생 빈도 계산
        Map<Integer, Long> dayFrequency = days.stream()
                .collect(Collectors.groupingBy(d -> d, Collectors.counting()));

        // 가장 빈도가 높은 날짜(일) 찾기
        Optional<Long> maxFreq = dayFrequency.values().stream().max(Long::compareTo);
        if (maxFreq.isEmpty()) return 0.0;

        // 날짜 일관성 점수 = 최다 발생 일자의 거래 수 / 전체 거래 수
        return (double) maxFreq.get() / transactions.size() * 0.2;
    }

    private double calculatePersistenceScore(List<Transaction> transactions) {
        // 거래의 지속성 분석
        if (transactions.isEmpty()) return 0.0;

        // 첫 거래와 마지막 거래 사이의 개월 수 계산
        LocalDate firstDate = transactions.stream()
                .map(t -> t.getDate().toLocalDate())
                .min(LocalDate::compareTo)
                .orElse(LocalDate.now());

        LocalDate lastDate = transactions.stream()
                .map(t -> t.getDate().toLocalDate())
                .max(LocalDate::compareTo)
                .orElse(LocalDate.now());

        long monthsBetween = ChronoUnit.MONTHS.between(
                YearMonth.from(firstDate),
                YearMonth.from(lastDate)
        ) + 1; // 당월 포함

        // 예상되는 발생 횟수
        long expectedOccurrences = monthsBetween;

        // 실제 발생 횟수 (월별로 그룹화하여 카운트)
        long actualOccurrences = transactions.stream()
                .map(t -> YearMonth.from(t.getDate().toLocalDate()))
                .distinct()
                .count();

        // 지속성 점수 = 실제 발생 횟수 / 예상 발생 횟수
        return Math.min(1.0, (double) actualOccurrences / expectedOccurrences) * 0.3;
    }
}