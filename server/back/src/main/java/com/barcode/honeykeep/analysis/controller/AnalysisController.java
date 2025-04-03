package com.barcode.honeykeep.analysis.controller;

import com.barcode.honeykeep.analysis.dto.AnalysisResponse;
import com.barcode.honeykeep.analysis.service.AnalysisService;
import com.barcode.honeykeep.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/analysis")
public class AnalysisController {

    private final AnalysisService analysisService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<AnalysisResponse>> getAnalysis(@RequestParam int month) {
        AnalysisResponse analysisResponse = analysisService.getAnalysis(month);

        if (analysisResponse != null) {
            return ResponseEntity.ok(ApiResponse.success(analysisResponse));
        }

        else {
            return ResponseEntity.ok(ApiResponse.noContent("거래 내역이 없습니다.", null));
        }
    }
}
