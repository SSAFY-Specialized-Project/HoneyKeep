package com.barcode.honeykeep.fixedexpense.service;

import java.util.*;
import java.util.stream.Collectors;

import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseCandidate;
import com.barcode.honeykeep.transaction.entity.Transaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
     * ML 서비스 상태 확인
     */
    public boolean isServiceAvailable() {
        try {
            return Boolean.TRUE.equals(webClient.get()
                    .uri(mlServiceUrl + "/health")
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(response -> true)
                    .onErrorReturn(false)
                    .block()); // 동기식 결과 반환을 위해 필요
        } catch (Exception e) {
            log.warn("ML 서비스 가용성 확인 실패", e);
            return false;
        }
    }

    /**
     * 고정지출을 pandas 기반으로 감지하는 파이썬 기능 요청
     * @param transactions
     * @return
     */
    public List<FixedExpenseCandidate> detectFixedExpenses(List<Transaction> transactions) {
        try {
            // 트랜잭션 데이터를 JSON으로 변환
            Map<String, Object> request = new HashMap<>();
            request.put("transactions", transactions.stream()
                    .map(this::convertTransactionToMap)
                    .toList());

            return (List<FixedExpenseCandidate>) webClient.post()
                    .uri(mlServiceUrl + "/detect-fixed-expenses")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, List<Map<String, Object>>>>() {})
                    .map(response -> {
                        List<Map<String, Object>> candidates = response.get("candidates");
                        if (candidates == null) {
                            return Collections.emptyList();
                        }
                        // 명시적 타입 변환을 통해 타입 안전성 확보
                        return candidates.stream()
                                .map(this::convertMapToFixedExpenseCandidate)
                                .collect(Collectors.toList());
                    })
                    .onErrorReturn(Collections.emptyList())
                    .block();
        } catch (Exception e) {
            log.error("고정지출 감지 실패: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * ML 서비스에 고정지출 예측 요청
     * @param features
     * @return
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
     * @param transactions
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
     * Transaction 엔티티를 Map으로 변환
     * @param tx
     * @return
     */
    private Map<String, Object> convertTransactionToMap(Transaction tx) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", tx.getId());
        map.put("amount", tx.getAmount().getAmount().doubleValue());
        map.put("merchant", tx.getName());
        map.put("date", tx.getDate().toString());
        map.put("userId", tx.getAccount().getUser().getId());
        map.put("accountId", tx.getAccount().getId());
        return map;
    }

    /**
     * Map을 FixedExpenseCandidate로 변환
     * @param map
     * @return
     */
    private FixedExpenseCandidate convertMapToFixedExpenseCandidate(Map<String, Object> map) {
        String merchantName = (String) map.get("merchant");
        double amountScore = ((Number) map.get("amountScore")).doubleValue();
        double dateScore = ((Number) map.get("dateScore")).doubleValue();
        double persistenceScore = ((Number) map.get("persistenceScore")).doubleValue();
        double totalScore = ((Number) map.get("totalScore")).doubleValue();
        Long userId = ((Number) map.get("userId")).longValue();
        Long accountId = ((Number) map.get("accountId")).longValue();

        // 트랜잭션 목록은 현재 없음 - 필요하면 별도 API 호출로 가져올 수 있음
        List<Transaction> transactions = new ArrayList<>();

        return new FixedExpenseCandidate(
                userId,
                accountId,
                merchantName,
                transactions,
                amountScore,
                dateScore,
                persistenceScore,
                totalScore
        );
    }
}