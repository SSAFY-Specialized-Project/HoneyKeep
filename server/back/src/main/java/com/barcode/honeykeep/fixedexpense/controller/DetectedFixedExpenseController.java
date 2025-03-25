package com.barcode.honeykeep.fixedexpense.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.fixedexpense.dto.DetectedFixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.dto.DetectedFixedExpenseUpdateRequest;
import com.barcode.honeykeep.fixedexpense.service.DetectedFixedExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fixed-expenses/detection")
@RequiredArgsConstructor
public class DetectedFixedExpenseController {

    private final DetectedFixedExpenseService detectedFixedExpenseService;

    /**
     * 발견된 고정지출 목록 조회
     *
     * @param userId
     * @return
     */
    @GetMapping("")
    public ResponseEntity<ApiResponse<List<DetectedFixedExpenseResponse>>> detectFixedExpense(
            @AuthenticationPrincipal UserId userId) {
        List<DetectedFixedExpenseResponse> responses = detectedFixedExpenseService.getAllDetectedFixedExpenses(userId.value());

        return ResponseEntity.ok()
                .body(ApiResponse.success("발견된 고정 지출 목록 조회 성공", responses));
    }

    /**
     * 발견된 고정지출을 수정하는 API
     * @param userId
     * @param id
     * @param request
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DetectedFixedExpenseResponse>> updateDetectedFixedExpense(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id,
            @RequestBody DetectedFixedExpenseUpdateRequest request) {
        DetectedFixedExpenseResponse response = detectedFixedExpenseService.updateDetectedFixedExpense(userId.value(), id, request);

        return ResponseEntity.ok()
                .body(ApiResponse.success("발견된 고정 지출 수정 성공", response));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<DetectedFixedExpenseResponse>> deleteDetectedFixedExpense(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {
        detectedFixedExpenseService.deleteDetectedFixedExpense(userId.value(), id);

        return ResponseEntity.ok()
                .body(ApiResponse.success("발견된 고정 지출 삭제 성공", null));
    }


}
