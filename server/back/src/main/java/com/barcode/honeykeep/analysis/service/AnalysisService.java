package com.barcode.honeykeep.analysis.service;

import com.barcode.honeykeep.analysis.dto.AnalysisResponse;
import com.barcode.honeykeep.analysis.repository.AnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class AnalysisService {

    private final AnalysisRepository analysisRepository;

    @Transactional
    public AnalysisResponse getAnalysis(int month) {

        return analysisRepository.getAnalysis(month);
    }
}
