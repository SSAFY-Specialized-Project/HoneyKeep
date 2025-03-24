package com.barcode.honeykeep.fixedexpense.controller;

import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.service.FixedExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
    // 이것만 구현 완료, 테스트 안 해봄
    @GetMapping
    // 인증인가 완료 후 토큰으로 유저아이디 바꾸는 방식으로 변경
    public ResponseEntity<List<FixedExpenseResponse>> getAllFixedExpenses(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(fixedExpenseService.getFixedExpenses(userId));
    }
    
    // 고정지출 생성 API
    @PostMapping
    public ResponseEntity<FixedExpenseResponse> createFixedExpenses(@AuthenticationPrincipal UserId userId,
                                                                    @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        return ResponseEntity.ok(fixedExpenseService.createFixedExpenses(userId, fixedExpenseRequest));
    }

    // 고정지출 수정 API
    @PutMapping("/{id}")
    public ResponseEntity<FixedExpenseResponse> updateFixedExpenses(
            @PathVariable Long id,
            @RequestBody FixedExpenseRequest fixedExpenseRequest) {
        return ResponseEntity.ok(fixedExpenseService.updateFixedExpenses(id, fixedExpenseRequest));
    }

    // 고정지출 삭제 API
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFixedExpenses(@PathVariable Long id) {
        if (!fixedExpenseService.checkId(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        fixedExpenseService.deleteFixedExpenses(id);
        return ResponseEntity.noContent().build();
    }


}
