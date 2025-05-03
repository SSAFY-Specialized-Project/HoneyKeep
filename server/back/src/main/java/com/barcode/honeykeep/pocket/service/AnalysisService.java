package com.barcode.honeykeep.pocket.service;

import com.barcode.honeykeep.account.dto.AccountResponse;
import com.barcode.honeykeep.account.service.AccountService;
import com.barcode.honeykeep.account.dto.AccountDetailResponse;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pocket.dto.*;
import com.barcode.honeykeep.pocket.entity.OverspendingReason;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.exception.PocketErrorCode;
import com.barcode.honeykeep.pocket.repository.OverspendingReasonRepository;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.pocket.type.UserType;
import com.barcode.honeykeep.transaction.dto.TransactionDetailResponse;
import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {
    private final AccountService accountService;
    private final PocketRepository pocketRepository;
    private final OverspendingReasonRepository overspendingReasonRepository;

    public SpendingAnalysisResponse getSpendingAnalysis(Long userId, int month) {
        
        // 1. 사용자 아이디로 계좌 목록 조회
        List<AccountResponse> accounts = accountService.getAccountsByUserId(userId);
        if (accounts == null || accounts.isEmpty()) {
            return emptyResponse();
        }

        // 2. 포켓 총 금액 계산
        long pocketTotal = calculatePocketTotal(accounts);

        // 3. 계획/비계획 소비, 성공/미완료/초과 포켓 분류
        AnalysisContext context = analyzeTransactionsAndPockets(accounts, userId, month);

        // 4. 사용자 유형 분류
        UserType userType = determineUserType(
                context.plannedAmount,
                context.unplannedAmount,
                context.successAmount,
                context.exceededAmount + context.incompleteAmount,
                context.pocketCount
        );

        return buildAnalysisResponse(userId, userType, pocketTotal, context);

    }

    /**
     * 데이터 없을 경우 응답값 설정
     */
    private SpendingAnalysisResponse emptyResponse() {
        return SpendingAnalysisResponse.builder()
                .userType(UserType.RUNAWAY.getLabel()) // 기본값은 '포켓 탈주러'
                .plannedAmount(0L)
                .unplannedAmount(0L)
                .pocketTotal(0L)
                .pocketUsage(
                        PocketUsageResponse.builder()
                                .successAmount(0L)
                                .incompleteAmount(0L)
                                .exceededAmount(0L)
                                .build()
                )
                .build();
    }

    /**
     * 포켓 총 금액 계산 메서드
     */
    private long calculatePocketTotal(List<AccountResponse> accounts) {
        return accounts.stream()
                .mapToLong(a -> a.getTotalUsedPocketAmount().longValue())
                .sum();
    }

    /**
     * 계산 관련 변수 정리
     */
    private static class AnalysisContext {
        long plannedAmount = 0;
        long unplannedAmount = 0;
        long successAmount = 0;
        long exceededAmount = 0;
        long incompleteAmount = 0;
        int pocketCount = 0;
        Map<Long, Long> pocketSpendingMap = new HashMap<>();
    }

    /**
     * todo : 초과 여부, 초과한 금액 저장해서 바로 불러오는 로직으로 추후 변경
     * 소비 분석 로직
     */
    private AnalysisContext analyzeTransactionsAndPockets(List<AccountResponse> accounts, Long userId, int month) {
        AnalysisContext ctx = new AnalysisContext();

        for (AccountResponse summary : accounts) {
            AccountDetailResponse detail = accountService.getAccountDetailById(summary.getAccountId(), userId);
            // ctx.pocketCount += detail.getPocketList().size();

            for (TransactionDetailResponse txn : detail.getTransactionList()) {

                if(txn.date().getMonthValue() == month && txn.type().equals(TransactionType.WITHDRAWAL)) {
                    long amount = txn.amount().longValue();

                    if (txn.pocketId() != null) {
                        ctx.plannedAmount += amount;
                        ctx.pocketSpendingMap.merge(txn.pocketId(), amount, Long::sum);
                    } else {
                        ctx.unplannedAmount += amount;
                    }
                }
            }

            for (PocketSummaryResponse pocket : detail.getPocketList()) {
                if(pocket.endDate() != null && pocket.endDate().getMonthValue() == month) {
                    long totalAmount = pocket.totalAmount();

                    long spent = ctx.pocketSpendingMap.getOrDefault(pocket.id(), 0L);

                    if ("USED".equals(pocket.type())) {
                        if (spent <= totalAmount) ctx.successAmount += totalAmount;
                        else ctx.exceededAmount += totalAmount;

                        ctx.pocketCount += 1;
                    } else {
                        ctx.incompleteAmount += totalAmount;
                    }
                }
            }
        }

        return ctx;
    }

    /**
     * 사용자 유형 분류 로직
     */
    private UserType determineUserType(long planned, long unplanned, long success, long fail, int pocketCount) {
        if (planned >= unplanned && success >= fail) {
            return UserType.MASTER;
        } else if (planned > unplanned) {
            return UserType.LOVER;
        } else if (unplanned > planned && pocketCount >= 4) {
            return UserType.EMOTIONAL;
        } else {
            return UserType.RUNAWAY;
        }
    }

    private SpendingAnalysisResponse buildAnalysisResponse(long userId, UserType type, long pocketTotal, AnalysisContext ctx) {
        List<OverspendingReasonCountResponse> reasons = overspendingReasonRepository
                .countReasonsGroupedByUser(userId)
                .stream()
                .map(p -> OverspendingReasonCountResponse.builder()
                        .label(p.getLabel())
                        .count(p.getCount())
                        .build())
                .toList();
        return SpendingAnalysisResponse.builder()
                .userType(type.getLabel())
                .plannedAmount(ctx.plannedAmount)
                .unplannedAmount(ctx.unplannedAmount)
                .pocketTotal(pocketTotal)
                .pocketUsage(
                        PocketUsageResponse.builder()
                                .successAmount(ctx.successAmount)
                                .incompleteAmount(ctx.incompleteAmount)
                                .exceededAmount(ctx.exceededAmount)
                                .build()
                )
                .overspendingReasons(reasons)
                .build();
    }

    /**
     * 금액 초과된 포켓에 대해 원인 설문 저장
     */
    @Transactional
    public void saveOverspendingReason(Long pocketId, OverspendingReasonRequest request) {
        Pocket pocket = pocketRepository.findById(pocketId)
                .orElseThrow(() -> new CustomException(PocketErrorCode.POCKET_NOT_FOUND));

        OverspendingReason reason = OverspendingReason.builder()
                .pocket(pocket)
                .reasonText(request.reasonText())
                .build();

        overspendingReasonRepository.save(reason);
    }

}