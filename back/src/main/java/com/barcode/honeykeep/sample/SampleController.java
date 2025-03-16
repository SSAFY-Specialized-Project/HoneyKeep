package com.barcode.honeykeep.sample;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sample")
public class SampleController {

    @GetMapping
    public ResponseEntity<String> sample(){
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping("/test1")
    public ResponseEntity<Map<String, Object>> test1(){
        long startTime = System.nanoTime();
        
        BigDecimal result = BigDecimal.valueOf(1.12).add(BigDecimal.valueOf(2.12));
        
        long endTime = System.nanoTime();
        long elapsedTimeInNanos = endTime - startTime;
        double elapsedTimeInMs = elapsedTimeInNanos / 1_000_000.0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("calculationTimeMs", elapsedTimeInMs);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test2")
    public ResponseEntity<Map<String, Object>> test2(){
        long startTime = System.nanoTime();
        
        double result = 1.12 + 2.12;
        
        long endTime = System.nanoTime();
        long elapsedTimeInNanos = endTime - startTime;
        double elapsedTimeInMs = elapsedTimeInNanos / 1_000_000.0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("calculationTimeMs", elapsedTimeInMs);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test1-loop")
    public ResponseEntity<Map<String, Object>> test1Loop(
            @RequestParam(value = "iterations", defaultValue = "1000000") int iterations) {
        long startTime = System.nanoTime();
        
        BigDecimal result = BigDecimal.ZERO;
        for (int i = 0; i < iterations; i++) {
            result = result.add(BigDecimal.valueOf(0.01));
        }
        
        long endTime = System.nanoTime();
        long elapsedTimeInNanos = endTime - startTime;
        double elapsedTimeInMs = elapsedTimeInNanos / 1_000_000.0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("iterations", iterations);
        response.put("calculationTimeMs", elapsedTimeInMs);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/test2-loop")
    public ResponseEntity<Map<String, Object>> test2Loop(
            @RequestParam(value = "iterations", defaultValue = "1000000") int iterations) {
        long startTime = System.nanoTime();
        
        double result = 0.0;
        for (int i = 0; i < iterations; i++) {
            result += 0.01;
        }
        
        long endTime = System.nanoTime();
        long elapsedTimeInNanos = endTime - startTime;
        double elapsedTimeInMs = elapsedTimeInNanos / 1_000_000.0;
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("iterations", iterations);
        response.put("calculationTimeMs", elapsedTimeInMs);
        
        return ResponseEntity.ok(response);
    }
}
