package com.barcode.honeykeep.analysis.repository.impl;

import com.barcode.honeykeep.analysis.dto.AnalysisResponse;
import com.barcode.honeykeep.analysis.repository.AnalysisRepository;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
@RequiredArgsConstructor
public class AnalysisRepositoryImpl implements AnalysisRepository {

    private final PocketRepository pocketRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public AnalysisResponse getAnalysis(long userId, int month) {
        // 1. 계획 소비
        // 사용 완료 된 포켓 (상태가 사용 완료인 총 포켓 금액)
        BigDecimal usedPocketAmount = pocketRepository.sumAmountByUserIdAndMonth(userId, month);

        // 2. 비계획 소비
        // 전체 거래 금액에서 포켓으로 등록하지 않고 거래한 금액 총합


        // 3. 지난 달 대비 얼마나 계획 소비 비율이 증가했는지
        // 소비 비율: 계획 소비 / (계획 소비 + 비계획 소비)

        // 4. 포켓 활용률
        // 사용 완료 포켓 개수 / 전체 포켓 개수

        // 5. 완료된 포켓
        // 사용 완료된 포켓 - 7번

        // 6. 미완료 포켓
        // 전체 포캣 개수 - 5번

        // 7. 초과된 포켓
        // 포켓에서 isExceed가 true인 포켓

        return null;
    }
}
