package com.barcode.honeykeep.analysis.repository.impl;

import com.barcode.honeykeep.analysis.dto.AnalysisResponse;
import com.barcode.honeykeep.analysis.repository.AnalysisRepository;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AnalysisRepositoryImpl implements AnalysisRepository {

    private final PocketRepository pocketRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public AnalysisResponse getAnalysis(int month) {
        return null;
    }
}
