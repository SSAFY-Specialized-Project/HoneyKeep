package com.barcode.honeykeep.analysis.repository;

import com.barcode.honeykeep.analysis.dto.AnalysisResponse;
import org.springframework.stereotype.Repository;

public interface AnalysisRepository {
    AnalysisResponse getAnalysis(int month);
}
