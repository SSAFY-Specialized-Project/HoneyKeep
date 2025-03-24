package com.barcode.honeykeep.fixedexpense.controller;

import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.service.FixedExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/fixed-expenses")
@RequiredArgsConstructor
public class FixedExpenseController {
    private final FixedExpenseService fixedExpenseService;

    // 고정지출 목록 조회 API
    @GetMapping
    public ResponseEntity<List<FixedExpenseResponse>> getAllFixedExpenses(@AuthenticationPrincipal UserId userId) {
        return ResponseEntity.ok(fixedExpenseService.getFixedExpenses(userId.getValue()));
    }
    
    // 고정지출 생성 API
    @PostMapping
    public ResponseEntity<FixedExpenseResponse> createFixedExpenses(@AuthenticationPrincipal UserId userId,
                                                                    @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        return ResponseEntity.ok(fixedExpenseService.createFixedExpenses(userId.getValue(), fixedExpenseRequest));
    }

    // 고정지출 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<FixedExpenseResponse> updateFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id,
            @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        return ResponseEntity.ok(fixedExpenseService.updateFixedExpenses(userId.getValue(), id, fixedExpenseRequest));
    }

    // 고정지출 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {
        fixedExpenseService.deleteFixedExpenses(userId.getValue(), id);
        return ResponseEntity.noContent().build();
    }


}
