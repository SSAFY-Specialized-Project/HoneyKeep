package com.barcode.honeykeep.fixedexpense.controller;

import com.barcode.honeykeep.common.vo.UserId;
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

    // 고정지출 목록 조회 API
    @GetMapping
    public ResponseEntity<List<FixedExpenseResponse>> getAllFixedExpenses(@AuthenticationPrincipal UserId userId) {
        return ResponseEntity.ok(fixedExpenseService.getAllFixedExpenses(userId.value()));
    }

    // 고정지출 상세 조회 API
    @GetMapping("/{id}")
    public ResponseEntity<FixedExpenseResponse> getFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {
        return ResponseEntity.ok(fixedExpenseService.getFixedExpenses(userId.value(), id));
    }
    
    // 고정지출 생성 API
    @Transactional
    @PostMapping
    public ResponseEntity<FixedExpenseResponse> createFixedExpenses(@AuthenticationPrincipal UserId userId,
                                                                    @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        return ResponseEntity.ok(fixedExpenseService.createFixedExpenses(userId.value(), fixedExpenseRequest));
    }

    // 고정지출 수정 API
    @Transactional
    @PutMapping("/{id}")
    public ResponseEntity<FixedExpenseResponse> updateFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id,
            @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        return ResponseEntity.ok(fixedExpenseService.updateFixedExpenses(userId.value(), id, fixedExpenseRequest));
    }

    // 고정지출 삭제 API
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFixedExpenses(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {
        fixedExpenseService.deleteFixedExpenses(userId.value(), id);
        return ResponseEntity.noContent().build();
    }


}
