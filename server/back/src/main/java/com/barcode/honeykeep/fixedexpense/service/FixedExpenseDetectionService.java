package com.barcode.honeykeep.fixedexpense.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import com.barcode.honeykeep.fixedexpense.dto.TransactionSummaryDto;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.user.repository.UserRepository;
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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * DetectedFixedExpenseService 와 다르게, 이 서비스 클래스는 고정지출을 감지하는 배치 작업만을 처리함.
 * <br/><br/>
 *
 * <h6>2025-03-29 고정지출 감지 1s ~ 3s</h6>
 *
 *
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FixedExpenseDetectionService {
    private final TransactionRepository transactionRepository;
    private final DetectedFixedExpenseRepository detectedFixedExpenseRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final MLFixedExpenseClient mlClient;

    /**
     * 고정지출 감지. 매월 1일
     */
    @Scheduled(cron = "0 0 0 1 * ?")
    @Transactional
    public List<FixedExpenseCandidate> detectMonthlyFixedExpenses() {
        log.info("고정지출 감지 배치 작업 시작");

        // ML 서비스 가용성 확인
        boolean mlServiceAvailable = mlClient.isServiceAvailable();
        log.info("ML 서비스 가용성: {}", mlServiceAvailable);

        if (!mlServiceAvailable) {
            log.error("ML 서비스 사용 불가로 고정지출 감지 배치 작업 중단");
            return List.of();
        }

        // 최근 6개월 모든 사용자의 거래내역을 들고온다.
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
        List<Transaction> allTransactions = transactionRepository.findByTypeAndDateAfter(TransactionType.WITHDRAWAL, sixMonthsAgo);
        if (allTransactions.isEmpty()) {
            log.info("분석할 거래내역이 없습니다");
            return List.of();
        }

        // ML 적용 가능한 사용자 ID 목록 조회
        List<Long> mlEnabledUserIds = getMlEnabledUserIds();
        log.info("ML 모델 적용 가능 사용자 수: {}", mlEnabledUserIds.size());

        // ML 서비스에 고정지출 감지 요청 (ML 적용 가능 사용자 ID 목록 포함)
        List<FixedExpenseCandidate> candidates = mlClient.detectFixedExpenses(allTransactions, mlEnabledUserIds);
        log.info("감지된 고정지출 후보: {}개", candidates.size());

        // 감지된 고정지출 저장
        createDetectedFixedExpenses(candidates);

        log.info("고정지출 감지 배치 작업 완료");

        return candidates;
    }

    /**
     * 매일 새벽 3시에 ML 모델 학습 실행
     * 누적된 피드백 데이터로 모델을 일괄 학습시킴
     */
    @Scheduled(cron = "0 0 3 * * 3")
    public void scheduledModelTraining() {
        log.info("ML 모델 학습 배치 작업 시작");
        
        // ML 서비스 가용성 확인
        boolean mlServiceAvailable = mlClient.isServiceAvailable();
        if (!mlServiceAvailable) {
            log.error("ML 서비스 사용 불가로 모델 학습 작업 중단");
            return;
        }
        
        try {
            // 피드백이 있는 고정지출 데이터 조회 (APPROVED 또는 REJECTED 상태)
            List<DetectedFixedExpense> feedbackExpenses = detectedFixedExpenseRepository
                    .findByStatusIn(List.of(DetectionStatus.APPROVED, DetectionStatus.REJECTED));
            
            log.info("학습에 사용할 피드백 데이터: {}개", feedbackExpenses.size());
            
            if (feedbackExpenses.isEmpty()) {
                log.info("학습에 사용할 피드백 데이터가 없습니다");
                return;
            }
            
            // 모델 학습 요청
            Map<String, Object> result = mlClient.trainModel(feedbackExpenses);
            log.info("ML 모델 학습 결과: {}", result);
        } catch (Exception e) {
            log.error("ML 모델 학습 중 오류 발생: {}", e.getMessage(), e);
        }
        
        log.info("ML 모델 학습 배치 작업 완료");
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
                        .findByUser_IdAndAccount_IdAndName(
                                fec.userId(),
                                fec.accountId(),
                                fec.merchantName()
                        );

                User user = userRepository.findById(fec.userId())
                        .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

                Account account = accountRepository.findById(fec.accountId())
                        .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

                if (existingExpense.isPresent()) {
                    // 기존 항목 업데이트
                    DetectedFixedExpense expense = existingExpense.get();
                    expense.update(
                            account,
                            fec.merchantName(),
                            fec.originName(),
                            fec.averageAmount().toString(),
                            fec.averageDay()
                    );
                    expense.updateDetectionAttributes(
                            fec.latestDate(),
                            fec.transactions().size(),
                            fec.totalScore(),
                            fec.amountScore(),
                            fec.dateScore(),
                            fec.persistenceScore(),
                            fec.periodicityScore()
                    );
                    detectedFixedExpenseRepository.save(expense);
                } else {
                    // 새 항목 생성
                    DetectedFixedExpense newExpense = DetectedFixedExpense.builder()
                            .user(user)
                            .account(account)
                            .name(fec.merchantName())
                            .originName(fec.originName())
                            .averageAmount(Money.of(fec.averageAmount()))
                            .averageDay(fec.averageDay())
                            .status(DetectionStatus.DETECTED)
                            .lastTransactionDate(fec.latestDate())
                            .transactionCount(fec.transactions().size())
                            .detectionScore(fec.totalScore())
                            .amountScore(fec.amountScore())
                            .dateScore(fec.dateScore())
                            .persistenceScore(fec.persistenceScore())
                            .periodicityScore(fec.periodicityScore())
                            .build();

                    detectedFixedExpenseRepository.save(newExpense);
                }
            } catch (Exception e) {
                log.error("고정지출 후보 처리 중 오류 발생: {}", e.getMessage(), e);
            }
        }
    }

        /**
     * ML 모델 적용 가능한 사용자 ID 목록 조회
     * 피드백(APPROVED 또는 REJECTED) 10개 이상인 사용자만 반환
     */
    private List<Long> getMlEnabledUserIds() {
        // 사용자별 피드백 수 계산
        Map<Long, Long> userFeedbackCounts = detectedFixedExpenseRepository
                .findByStatusIn(List.of(DetectionStatus.APPROVED, DetectionStatus.REJECTED))
                .stream()
                .collect(Collectors.groupingBy(
                        expense -> expense.getUser().getId(),
                        Collectors.counting()
                ));
        
        // 피드백 10개 이상인 사용자 ID 추출
        return userFeedbackCounts.entrySet().stream()
                .filter(entry -> entry.getValue() >= 10)
                .map(Map.Entry::getKey)
                .toList();
    }

}

