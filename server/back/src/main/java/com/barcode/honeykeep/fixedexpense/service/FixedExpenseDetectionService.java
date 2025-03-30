package com.barcode.honeykeep.fixedexpense.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
 * <h6>2025-03-30 10,000개 거래내역 고정지출 감지 20s ~ 30s 최적화 무조건 필요.</h6>
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

        // 최근 6개월 기간 설정
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

        // ML 적용 가능한 사용자 ID 목록
        List<Long> mlEnabledUserIds = getMlEnabledUserIds();

        // 사용자 목록 조회
        List<User> users = userRepository.findAll();
        List<FixedExpenseCandidate> allCandidates = new ArrayList<>();

        // 사용자별로 개별 처리
        for (User user : users) {
            try {
                log.info("사용자 ID: {} 고정지출 감지 시작", user.getId());

                // 해당 사용자의 거래내역만 조회
                List<Transaction> userTransactions = transactionRepository
                        .findByAccount_User_IdAndTypeAndDateAfter(user.getId(), TransactionType.WITHDRAWAL, sixMonthsAgo);

                if (userTransactions.isEmpty()) {
                    log.info("사용자 ID: {} 분석할 거래내역 없음", user.getId());
                    continue;
                }

                // 해당 사용자의 ML 모델 적용 가능 여부 확인
                boolean enableMlForUser = mlEnabledUserIds.contains(user.getId());

                // 해당 사용자의 고정지출 감지
                List<FixedExpenseCandidate> userCandidates =
                        mlClient.detectFixedExpenses(userTransactions, enableMlForUser);

                log.info("사용자 ID: {} 감지된 고정지출: {}개",
                        user.getId(), userCandidates.size());

                // 전체 목록에 추가
                allCandidates.addAll(userCandidates);
            } catch (Exception e) {
                log.error("사용자 ID: {} 고정지출 감지 중 오류: {}",
                        user.getId(), e.getMessage(), e);
            }
        }

        log.info("전체 감지된 고정지출 후보: {}개", allCandidates.size());

        // 감지된 고정지출 저장
        createDetectedFixedExpenses(allCandidates);

        log.info("고정지출 감지 배치 작업 완료");

        return allCandidates;
    }

    /**
     * 매주 수요일 새벽 3시에 ML 모델 학습 실행
     * <p>누적된 피드백 데이터로 모델을 일괄 학습시킴</p>
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
                            fec.avgInterval(),
                            fec.latestDate(),
                            fec.transactions().size(),
                            fec.totalScore(),
                            fec.amountScore(),
                            fec.dateScore(),
                            fec.persistenceScore(),
                            fec.periodicityScore(),
                            fec.weekendRatio(),
                            fec.intervalStd(),
                            fec.intervalCv(),
                            fec.continuityRatio(),
                            fec.amountTrendSlope(),
                            fec.amountTrendR2()
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
                            .avgInterval(fec.avgInterval())
                            .lastTransactionDate(fec.latestDate())
                            .transactionCount(fec.transactions().size())
                            .detectionScore(fec.totalScore())
                            .amountScore(fec.amountScore())
                            .dateScore(fec.dateScore())
                            .persistenceScore(fec.persistenceScore())
                            .periodicityScore(fec.periodicityScore())
                            .weekendRatio(fec.weekendRatio())
                            .intervalStd(fec.intervalStd())
                            .intervalCv(fec.intervalCv())
                            .continuityRatio(fec.continuityRatio())
                            .amountTrendSlope(fec.amountTrendSlope())
                            .amountTrendR2(fec.amountTrendR2())
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

