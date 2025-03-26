package com.barcode.honeykeep.fixedexpense.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.fixedexpense.entity.DetectedFixedExpense;
import com.barcode.honeykeep.fixedexpense.type.DetectionStatus;
import com.barcode.honeykeep.transaction.type.TransactionType;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseCandidate;
import com.barcode.honeykeep.fixedexpense.repository.DetectedFixedExpenseRepository;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.user.service.UserService;

import lombok.RequiredArgsConstructor;

/**
 * DetectedFixedExpenseService 와 다르게, 이 서비스 클래스는 고정지출을 감지하는 배치 작업만을 처리함.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FixedExpenseDetectionService {
    private final TransactionRepository transactionRepository;
    private final DetectedFixedExpenseRepository detectedFixedExpenseRepository;
    private final UserService userService;
    private final AuthRepository authRepository;
    private final AccountRepository accountRepository;
    private final MLFixedExpenseClient mlClient;

    private Map<Long, Map<Long, List<Transaction>>> userAccountTransactions;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void detectMonthlyFixedExpenses() {
        // 가져오기
        getUserAccountTransactions();

        // ML 서비스 가용성 확인
        boolean mlServiceAvailable = mlClient.isServiceAvailable();
        log.info("ML 서비스 가용성: {}", mlServiceAvailable);

        // 계산
        for (Map.Entry<Long, Map<Long, List<Transaction>>> userEntry : userAccountTransactions.entrySet()) {
            Long userId = userEntry.getKey();
            Map<Long, List<Transaction>> accountTransactions = userEntry.getValue();

            for (Map.Entry<Long, List<Transaction>> accountEntry : accountTransactions.entrySet()) {
                Long accountId = accountEntry.getKey();
                List<Transaction> transactions = accountEntry.getValue();

                // 가맹점별로 그룹화하여 분석
                analyzeMerchantTransactions(userId, accountId, transactions, mlServiceAvailable);
            }
        }
    }

    /**
     * 각 유저들의 모든 계좌에 해당하는 거래내역들을 조회 및 저장
     */
    private void getUserAccountTransactions() {
        List<Long> userIds = userService.getAllUserIds();
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        userAccountTransactions = new HashMap<>();

        for (Long userId : userIds) {
            List<Transaction> transactions = transactionRepository.findByAccount_User_IdAndTypeAndDateAfter(userId, TransactionType.WITHDRAWAL, sixMonthsAgo);

            Map<Long, List<Transaction>> accountTransactions = transactions.stream()
                    .collect(Collectors.groupingBy(
                            transaction -> transaction.getAccount().getId()  // 계좌 ID로 그룹화
                    ));

            userAccountTransactions.put(userId, accountTransactions);
        }
    }

    private void analyzeMerchantTransactions(Long userId, Long accountId, List<Transaction> transactions, boolean mlServiceAvailable) {
        // 가맹점별로 거래 그룹화
        Map<String, List<Transaction>> merchantTransactions = transactions.stream()
                .collect(Collectors.groupingBy(Transaction::getName));

        // 고정지출 후보를 담을 리스트 생성
        List<FixedExpenseCandidate> fixedExpenseCandidates = new ArrayList<>();
        
        // ML 학습을 위한 데이터 수집
        List<Map<String, Object>> mlTrainingData = new ArrayList<>();

        // 각 가맹점별로 고정지출 여부 판단
        for (Map.Entry<String, List<Transaction>> entry : merchantTransactions.entrySet()) {
            String merchantName = entry.getKey();
            List<Transaction> merchantTxs = entry.getValue();

            // 최소 3회 이상 거래가 있어야 분석
            if (merchantTxs.size() < 3) continue;

            // 월별로 거래 그룹화
            Map<YearMonth, List<Transaction>> transactionsByMonth = merchantTxs.stream()
                    .collect(Collectors.groupingBy(tx ->
                            YearMonth.from(tx.getDate().toLocalDate())
                    ));

            // 월별 평균 거래 횟수 계산
            double avgTransactionsPerMonth = (double) merchantTxs.size() / transactionsByMonth.size();

            // 평균 거래 횟수가 1.34회를 초과하는 경우 고정지출이 아님
            if (avgTransactionsPerMonth > 1.34) {
                continue; // 다음 가맹점으로 넘어감
            }

            // 점수 계산
            double amountScore = calculateAmountScore(merchantTxs);
            double dateScore = calculateDateScore(merchantTxs);
            double persistenceScore = calculatePersistenceScore(merchantTxs);

            // 종합 점수
            double totalScore = amountScore + dateScore + persistenceScore;

            // 평균 거래 간격 계산 (ML 모델 특성으로 사용)
            List<LocalDate> dates = merchantTxs.stream()
                    .map(t -> t.getDate().toLocalDate())
                    .sorted()
                    .toList();

            double avgInterval = 0;
            if (merchantTxs.size() > 1) {
                long totalDays = 0;
                for (int i = 1; i < dates.size(); i++) {
                    totalDays += ChronoUnit.DAYS.between(dates.get(i-1), dates.get(i));
                }
                avgInterval = (double) totalDays / (dates.size() - 1);
            }

            // 규칙 기반 고정지출 판단
            boolean ruleBasedResult = totalScore >= 0.75;

            // ML 서비스 예측
            boolean mlPrediction = false;
            if (mlServiceAvailable) {
                Map<String, Object> features = new HashMap<>();
                features.put("amountScore", amountScore);
                features.put("dateScore", dateScore);
                features.put("persistenceScore", persistenceScore);
                features.put("transactionCount", merchantTxs.size());
                features.put("avgInterval", avgInterval);

                mlPrediction = mlClient.predictIsFixedExpense(features);

                // ML 학습 데이터 수집
                Map<String, Object> trainingData = new HashMap<>(features);
                trainingData.put("isFixedExpense", ruleBasedResult); // 초기에는 규칙 기반 결과로 학습
                mlTrainingData.add(trainingData);
            }

            // 하이브리드 판단 (초기에는 규칙 기반에 더 높은 비중)
            boolean isFixedExpense;
            if (mlServiceAvailable) {
                // 규칙 기반과 ML 예측이 모두 동의하면 확실한 고정지출
                if (ruleBasedResult && mlPrediction) {
                    isFixedExpense = true;
                }
                // 둘 중 하나만 긍정이면 규칙 기반에 더 높은 가중치 부여
                else if (ruleBasedResult || mlPrediction) {
                    isFixedExpense = ruleBasedResult; // 초기에는 규칙 기반 결과 우선
                }
                // 둘 다 부정이면 고정지출이 아님
                else {
                    isFixedExpense = false;
                }
            } else {
                // ML 서비스 사용 불가 시 규칙 기반만 사용
                isFixedExpense = ruleBasedResult;
            }

            // 고정지출로 판단되면 후보 리스트에 추가
            if (isFixedExpense) {
                fixedExpenseCandidates.add(
                        new FixedExpenseCandidate(
                                userId,
                                accountId,
                                merchantName,
                                merchantTxs,
                                amountScore,
                                dateScore,
                                persistenceScore,
                                totalScore
                        )
                );
            }
        }
        
        // ML 모델 학습 데이터 전송 (충분한 데이터가 있는 경우)
        if (mlServiceAvailable && !mlTrainingData.isEmpty()) {
            mlClient.trainModel(mlTrainingData);
        }
        
        // 고정지출 후보 처리
        createDetectedFixedExpense(fixedExpenseCandidates);
    }

    //TODO:
    // 기존 감지된 고정지출이 있는지 확인
    // 평균 금액, 평균 발생일, 최근 거래일 등 계산
    // DetectedFixedExpense 엔티티 생성 및 저장
    private void createDetectedFixedExpense(List<FixedExpenseCandidate> list) {
        for (FixedExpenseCandidate fec : list) {
            // 1. 기존 감지된 고정지출이 있는지 확인
            Optional<DetectedFixedExpense> existingExpense = detectedFixedExpenseRepository
                    .findByUser_IdAndAccount_IdAndOriginName(
                            fec.userId(),
                            fec.accountId(),
                            fec.merchantName()
                    );

            // 2. 평균 금액 계산
            BigDecimal avgAmount = fec.transactions().stream()
                    .map(t -> t.getAmount().getAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(fec.transactions().size()), 2, RoundingMode.HALF_UP);

            // 3. 평균 발생일 계산
            double avgDay = fec.transactions().stream()
                    .mapToInt(t -> t.getDate().toLocalDate().getDayOfMonth())
                    .average()
                    .orElse(0);
            int avgDayOfMonth = (int) Math.round(avgDay);

            // 4. 최근 거래일 가져오기
            LocalDate latestTransactionDate = fec.transactions().stream()
                    .map(t -> t.getDate().toLocalDate())
                    .max(LocalDate::compareTo)
                    .orElse(LocalDate.now());

            // 5. 거래 횟수 계산
            int transactionCount = fec.transactions().size();

            User user = authRepository.findById(fec.userId())
                    .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

            Account account = accountRepository.findById(fec.accountId())
                    .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

            // 6. DetectedFixedExpense 엔티티 생성 또는 업데이트
            if (existingExpense.isPresent()) {
                DetectedFixedExpense expense = existingExpense.get();
                expense.update(
                        account,
                        fec.merchantName(),
                        avgAmount.toString(),
                        avgDayOfMonth
                );
                expense.updateDetectionAttributes(
                        latestTransactionDate,
                        transactionCount,
                        fec.totalScore(),
                        fec.amountScore(),
                        fec.dateScore(),
                        fec.persistenceScore()
                );
                detectedFixedExpenseRepository.save(expense);
            } else {
                DetectedFixedExpense newExpense = DetectedFixedExpense.builder()
                        .user(user)
                        .account(account)
                        .name(fec.merchantName())
                        .originName(fec.merchantName())
                        .averageAmount(Money.of(avgAmount))
                        .averageDay(avgDayOfMonth)
                        .status(DetectionStatus.DETECTED)
                        .lastTransactionDate(latestTransactionDate)
                        .transactionCount(transactionCount)
                        .detectionScore(fec.totalScore())
                        .amountScore(fec.amountScore())
                        .dateScore(fec.dateScore())
                        .persistenceScore(fec.persistenceScore())
                        .build();

                detectedFixedExpenseRepository.save(newExpense);
            }
        }
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
        return Math.max(0, (1 - Math.min(cv, 1))) * 0.25;
    }

    private double calculateDateScore(List<Transaction> transactions) {
        if (transactions.size() < 2) return 0.0;

        // 거래일자 추출 및 정렬
        List<LocalDate> dates = transactions.stream()
                .map(t -> t.getDate().toLocalDate())
                .sorted()
                .toList();

        // 각 거래일의 일(day) 추출
        List<Integer> days = dates.stream()
                .map(LocalDate::getDayOfMonth)
                .toList();

        // +/- 2일 범위를 고려한 클러스터 생성
        Map<Integer, Integer> dayClusters = new HashMap<>();
        for (Integer day : days) {
            boolean foundCluster = false;
            // 기존 클러스터 중 +/- 2일 범위 내에 있는지 확인
            for (Integer clusterDay : dayClusters.keySet()) {
                if (Math.abs(day - clusterDay) <= 2) {
                    dayClusters.put(clusterDay, dayClusters.get(clusterDay) + 1);
                    foundCluster = true;
                    break;
                }
            }
            // 새로운 클러스터 생성
            if (!foundCluster) {
                dayClusters.put(day, 1);
            }
        }

        // 가장 큰, 즉 가장 많은 거래를 포함하는 클러스터 찾기
        Optional<Integer> maxClusterSize = dayClusters.values().stream().max(Integer::compareTo);
        if (maxClusterSize.isEmpty()) return 0.0;

        // 날짜 일관성 점수 = 최대 클러스터 크기 / 전체 거래 수
        return (double) maxClusterSize.get() / transactions.size() * 0.25;
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

        // 예상되는 발생 횟수
        long expectedOccurrences = ChronoUnit.MONTHS.between(
                YearMonth.from(firstDate),
                YearMonth.from(lastDate)
        ) + 1; // 당월 포함

        // 실제 발생 횟수 (월별로 그룹화하여 카운트)
        long actualOccurrences = transactions.stream()
                .map(t -> YearMonth.from(t.getDate().toLocalDate()))
                .distinct()
                .count();

        // 지속성 점수 = 실제 발생 횟수 / 예상 발생 횟수
        return Math.min(1.0, (double) actualOccurrences / expectedOccurrences) * 0.5;
    }

}

