package com.barcode.honeykeep.fixedexpense.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.fixedexpense.dto.DetectedFixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.service.FixedExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fixed-expenses")
@RequiredArgsConstructor
public class FixedExpenseController {
    private final FixedExpenseService fixedExpenseService;


    /**
     * 고정지출 전체 조회 API
     *
     * @param userId
     * @return
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FixedExpenseResponse>>> getAllFixedExpenses(
            @AuthenticationPrincipal UserId userId) {
        List<FixedExpenseResponse> response = fixedExpenseService.getAllFixedExpenses(userId.value());

        return ResponseEntity.ok()
                .body(ApiResponse.success(response));
    }

    /**
     * 고정지출 상세 조회 API
     *
     * @param userId
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FixedExpenseResponse>> getFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {
        FixedExpenseResponse response = fixedExpenseService.getFixedExpenses(userId.value(), id);

        return ResponseEntity.ok()
                .body(ApiResponse.success(response));
    }

    /**
     * 고정지출 생성 API
     *
     * @param userId
     * @param fixedExpenseRequest
     * @return
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FixedExpenseResponse>> createFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        FixedExpenseResponse response = fixedExpenseService.createFixedExpenses(userId.value(), fixedExpenseRequest);

        return ResponseEntity.ok()
                .body(ApiResponse.success(response));
    }

    /**
     * 고정지출 수정 API
     *
     * @param userId
     * @param id
     * @param fixedExpenseRequest
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FixedExpenseResponse>> updateFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id,
            @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        FixedExpenseResponse response = fixedExpenseService.updateFixedExpenses(userId.value(), id, fixedExpenseRequest);

        return ResponseEntity.ok()
                .body(ApiResponse.success(response));
    }

    /**
     * 고정지출 삭제 API
     *
     * @param userId
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {
        fixedExpenseService.deleteFixedExpenses(userId.value(), id);

        return ResponseEntity.ok()
                .body(ApiResponse.success("고정지출 삭제 완료", null));
    }

}
