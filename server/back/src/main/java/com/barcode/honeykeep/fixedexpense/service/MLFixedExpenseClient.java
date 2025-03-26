package com.barcode.honeykeep.fixedexpense.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class MLFixedExpenseClient {
    
    private final WebClient webClient;
    
    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;
    
    /**
     * ML 서비스에 고정지출 예측 요청
     */
    public boolean predictIsFixedExpense(Map<String, Object> features) {
        try {
            return Boolean.TRUE.equals(webClient.post()
                    .uri(mlServiceUrl + "/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(features)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(response -> Boolean.TRUE.equals(response.get("is_fixed_expense")))
                    .onErrorReturn(false)
                    .block()); // 동기식 결과 반환을 위해 필요
        } catch (Exception e) {
            log.error("ML 서비스 예측 오류", e);
            // ML 서비스 실패 시 규칙 기반 결과 사용
            double totalScore = 
                    ((Number) features.getOrDefault("amountScore", 0.0)).doubleValue() +
                    ((Number) features.getOrDefault("dateScore", 0.0)).doubleValue() +
                    ((Number) features.getOrDefault("persistenceScore", 0.0)).doubleValue();
            return totalScore >= 0.75;
        }
    }
    
    /**
     * 모델 학습을 위해 거래 데이터 전송 (비동기)
     */
    public void trainModel(List<Map<String, Object>> transactions) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("transactions", transactions);
            
            webClient.post()
                    .uri(mlServiceUrl + "/train")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .doOnSuccess(response -> log.info("ML 모델 학습 요청 성공: {}", response))
                    .doOnError(error -> log.error("ML 모델 학습 요청 실패", error))
                    .onErrorComplete()
                    .subscribe(); // 비동기 실행
        } catch (Exception e) {
            log.error("ML 모델 학습 요청 실패", e);
        }
    }
    
    /**
     * ML 서비스 상태 확인
     */
    public boolean isServiceAvailable() {
        try {
            return webClient.get()
                    .uri(mlServiceUrl + "/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(response -> true)
                    .onErrorReturn(false)
                    .block(); // 동기식 결과 반환을 위해 필요
        } catch (Exception e) {
            log.warn("ML 서비스 상태 확인 실패", e);
            return false;
        }
    }
}