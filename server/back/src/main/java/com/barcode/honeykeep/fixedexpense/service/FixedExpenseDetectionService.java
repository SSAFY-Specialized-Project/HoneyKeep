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

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseCandidate;
import com.barcode.honeykeep.fixedexpense.entity.DetectedFixedExpense;
import com.barcode.honeykeep.fixedexpense.repository.DetectedFixedExpenseRepository;
import com.barcode.honeykeep.fixedexpense.type.DetectionStatus;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.transaction.type.TransactionType;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * DetectedFixedExpenseService 와 다르게, 이 서비스 클래스는 고정지출을 감지하는 배치 작업만을 처리함.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FixedExpenseDetectionService {
    private final TransactionRepository transactionRepository;
    private final DetectedFixedExpenseRepository detectedFixedExpenseRepository;
    private final AuthRepository authRepository;
    private final AccountRepository accountRepository;
    private final MLFixedExpenseClient mlClient;

    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public void detectMonthlyFixedExpenses() {
        log.info("고정지출 감지 배치 작업 시작");

        // ML 서비스 가용성 확인
        boolean mlServiceAvailable = mlClient.isServiceAvailable();
        log.info("ML 서비스 가용성: {}", mlServiceAvailable);

        if (!mlServiceAvailable) {
            log.error("ML 서비스 사용 불가로 고정지출 감지 배치 작업 중단");
            return;
        }

        // 최근 6개월 모든 사용자의 거래내역을 들고온다.
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Transaction> allTransactions = transactionRepository.findByTypeAndDateAfter(TransactionType.WITHDRAWAL, sixMonthsAgo);
        if (allTransactions.isEmpty()) {
            log.info("분석할 거래내역이 없습니다");
            return;
        }

        // ML 서비스에 고정지출 감지 요청
        List<FixedExpenseCandidate> candidates = mlClient.detectFixedExpenses(allTransactions);
        log.info("감지된 고정지출 후보: {}개", candidates.size());

        // 감지된 고정지출 저장
        createDetectedFixedExpenses(candidates);

        log.info("고정지출 감지 배치 작업 완료");
    }

    /**
     * 감지된 고정지출 후보들을 DB에 저장
     */
    private void createDetectedFixedExpenses(List<FixedExpenseCandidate> candidates) {
        for (FixedExpenseCandidate fec : candidates) {
            log.info("고정지출 후보: {}, 사용자: {}, 계좌: {}, 점수: {}",
                    fec.merchantName(), fec.userId(), fec.accountId(), fec.totalScore());

            try {
                // 기존 감지된 고정지출이 있는지 확인
                Optional<DetectedFixedExpense> existingExpense = detectedFixedExpenseRepository
                        .findByUser_IdAndAccount_IdAndOriginName(
                                fec.userId(),
                                fec.accountId(),
                                fec.merchantName()
                        );

                User user = authRepository.findById(fec.userId())
                        .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

                Account account = accountRepository.findById(fec.accountId())
                        .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

                // 평균 금액 계산 (필요시 트랜잭션으로부터)
                BigDecimal avgAmount = calculateAverageAmount(fec);

                // 평균 발생일 (필요시 트랜잭션으로부터)
                int avgDayOfMonth = calculateAverageDayOfMonth(fec);

                // 최근 거래일 (필요시 트랜잭션으로부터)
                LocalDate latestTransactionDate = getLatestTransactionDate(fec);

                if (existingExpense.isPresent()) {
                    // 기존 항목 업데이트
                    DetectedFixedExpense expense = existingExpense.get();
                    expense.update(
                            account,
                            fec.merchantName(),
                            avgAmount.toString(),
                            avgDayOfMonth
                    );
                    expense.updateDetectionAttributes(
                            latestTransactionDate,
                            fec.transactions().size(),
                            fec.totalScore(),
                            fec.amountScore(),
                            fec.dateScore(),
                            fec.persistenceScore()
                    );
                    detectedFixedExpenseRepository.save(expense);
                } else {
                    // 새 항목 생성
                    DetectedFixedExpense newExpense = DetectedFixedExpense.builder()
                            .user(user)
                            .account(account)
                            .name(fec.merchantName())
                            .originName(fec.merchantName())
                            .averageAmount(Money.of(avgAmount))
                            .averageDay(avgDayOfMonth)
                            .status(DetectionStatus.DETECTED)
                            .lastTransactionDate(latestTransactionDate)
                            .transactionCount(fec.transactions().size())
                            .detectionScore(fec.totalScore())
                            .amountScore(fec.amountScore())
                            .dateScore(fec.dateScore())
                            .persistenceScore(fec.persistenceScore())
                            .build();

                    detectedFixedExpenseRepository.save(newExpense);
                }
            } catch (Exception e) {
                log.error("고정지출 후보 처리 중 오류 발생: {}", e.getMessage(), e);
            }
        }
    }

    /**
     * 평균 금액 계산 (transactions가 비어있을 경우 대비)
     */
    private BigDecimal calculateAverageAmount(FixedExpenseCandidate fec) {
        if (!fec.transactions().isEmpty()) {
            return fec.transactions().stream()
                    .map(t -> t.getAmount().getAmount())
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(fec.transactions().size()), 2, RoundingMode.HALF_UP);
        }

        // ML 서비스로부터 평균 금액 정보를 받아오는 경우
        // 현재 구현에서는 트랜잭션 목록이 비어있을 수 있음
        // 이 경우 추가 API 호출 또는 다른 방법으로 평균 금액 계산 필요

        // 임시로 0 반환
        return BigDecimal.ZERO;
    }

    /**
     * 평균 발생일 계산 (transactions가 비어있을 경우 대비)
     */
    private int calculateAverageDayOfMonth(FixedExpenseCandidate fec) {
        if (!fec.transactions().isEmpty()) {
            double avgDay = fec.transactions().stream()
                    .mapToInt(t -> t.getDate().toLocalDate().getDayOfMonth())
                    .average()
                    .orElse(0);
            return (int) Math.round(avgDay);
        }

        // 임시로 1일 반환
        return 1;
    }

    /**
     * 최근 거래일 가져오기 (transactions가 비어있을 경우 대비)
     */
    private LocalDate getLatestTransactionDate(FixedExpenseCandidate fec) {
        if (!fec.transactions().isEmpty()) {
            return fec.transactions().stream()
                    .map(t -> t.getDate().toLocalDate())
                    .max(LocalDate::compareTo)
                    .orElse(LocalDate.now());
        }

        // 데이터 없으면 현재 날짜 반환
        return LocalDate.now();
    }

}

