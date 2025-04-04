package com.barcode.honeykeep.analysis.repository;

import com.barcode.honeykeep.analysis.dto.AnalysisResponse;

public interface AnalysisRepository {
    AnalysisResponse getAnalysis(long userId, int month);
}
