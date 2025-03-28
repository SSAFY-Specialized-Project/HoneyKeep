package com.barcode.honeykeep.sample;

import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.fixedexpense.dto.DetectedFixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseCandidate;
import com.barcode.honeykeep.fixedexpense.service.FixedExpenseDetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sample")
@RequiredArgsConstructor
public class SampleController {

    private final FixedExpenseDetectionService service;

    @GetMapping
    public ResponseEntity<String> sample() {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping("/test1")
    public ResponseEntity<String> test1() {
        return ResponseEntity.ok("Hello world");
    }

    @GetMapping("/test2")
    public ResponseEntity<?> test2(@AuthenticationPrincipal UserId userId) {
        List<FixedExpenseCandidate> response = service.detectMonthlyFixedExpenses();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test3")
    public ResponseEntity<String> test3(@AuthenticationPrincipal UserId userId) {
        service.detectMonthlyFixedExpenses();
        return ResponseEntity.ok("dd");
    }

}
