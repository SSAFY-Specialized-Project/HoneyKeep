package com.barcode.honeykeep.fixedexpense.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.barcode.honeykeep.fixedexpense.dto.TransactionSummaryDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseCandidate;
import com.barcode.honeykeep.fixedexpense.entity.DetectedFixedExpense;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class MLFixedExpenseClient {

    private final WebClient webClient;
    private final TransactionRepository transactionRepository;

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
     *
     * @param transactions 거래 내역 목록
     * @param mlEnabledUserIds ML 모델 적용 가능한 사용자 ID 목록 (피드백 10개 이상)
     * @return 감지된 고정지출 후보 목록
     */
    public List<FixedExpenseCandidate> detectFixedExpenses(List<Transaction> transactions, List<Long> mlEnabledUserIds) {
        try {
            // 트랜잭션 데이터를 JSON으로 변환
            Map<String, Object> request = new HashMap<>();
            request.put("transactions", transactions.stream()
                    .map(this::convertTransactionToMap)
                    .toList());
            
            // ML 적용 가능한 사용자 ID 목록 추가
            request.put("ml_enabled_user_ids", mlEnabledUserIds);

            return (List<FixedExpenseCandidate>) webClient.post()
                    .uri(mlServiceUrl + "/detect-fixed-expenses")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, List<Map<String, Object>>>>() {
                    })
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
     * 모델 학습을 위해 감지된 고정지출 데이터 전송 (비동기)
     *
     * @param detectedExpenses 감지된 고정지출 목록 (피드백 상태 포함)
     * @return 학습 결과
     */
    public Map<String, Object> trainModel(List<DetectedFixedExpense> detectedExpenses) {
        try {
            // DetectedFixedExpense를 학습 데이터 형식으로 변환
            List<Map<String, Object>> trainingData = detectedExpenses.stream()
                    .map(this::convertDetectedExpenseToTrainingData)
                    .toList();

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("data", Map.of("detectedFixedExpenses", trainingData));

            return webClient.post()
                    .uri(mlServiceUrl + "/train")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .onErrorReturn(Map.of("status", "error", "message", "ML service error"))
                    .block(); // 동기식 호출
        } catch (Exception e) {
            log.error("감지된 고정지출 데이터로 모델 학습 요청 실패", e);
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

    /**
     * Transaction 엔티티를 Map으로 변환
     *
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
     *
     * @param map
     * @return
     */
    private FixedExpenseCandidate convertMapToFixedExpenseCandidate(Map<String, Object> map) {
        String merchantName = (String) map.get("merchant");
        String originName = (String) map.get("originalMerchant");
        Double amountScore = ((Number) map.get("amountScore")).doubleValue();
        Double dateScore = ((Number) map.get("dateScore")).doubleValue();
        Double persistenceScore = ((Number) map.get("persistenceScore")).doubleValue();
        Double periodicityScore = ((Number) map.get("periodicityScore")).doubleValue();
        Double totalScore = ((Number) map.get("totalScore")).doubleValue();
        Double averageAmount = ((Number) map.get("averageAmount")).doubleValue();
        Integer averageDay = ((Number) map.get("averageDay")).intValue();
        Long userId = ((Number) map.get("userId")).longValue();
        Long accountId = ((Number) map.get("accountId")).longValue();

        // latestDate 처리 추가
        String latestDateStr = (String) map.get("latestDate");
        LocalDate latestDate = null;
        if (latestDateStr != null) {
            latestDate = LocalDate.parse(latestDateStr);
        }

        List<TransactionSummaryDto> transactions = transactionRepository.findTransactionSummariesByAccountAndName(accountId, merchantName);

        return new FixedExpenseCandidate(
                userId,
                accountId,
                merchantName,
                originName,
                transactions,
                amountScore,
                dateScore,
                persistenceScore,
                periodicityScore,
                totalScore,
                averageAmount,
                averageDay,
                latestDate
        );
    }

    /**
     * DetectedFixedExpense를 학습 데이터 형식으로 변환
     */
    private Map<String, Object> convertDetectedExpenseToTrainingData(DetectedFixedExpense expense) {
        Map<String, Object> data = new HashMap<>();
        
        // 학습에 필요한 특성들
        data.put("transactionId", expense.getOriginName() + "_" + expense.getAccount().getId());
        data.put("amountScore", expense.getAmountScore());
        data.put("dateScore", expense.getDateScore());
        data.put("persistenceScore", expense.getPersistenceScore());
        data.put("transactionCount", expense.getTransactionCount());
        data.put("userId", expense.getUser().getId());
        data.put("accountId", expense.getAccount().getId());
        data.put("merchant", expense.getOriginName());
        
        // APPROVED/REJECTED 상태를 isFixedExpense로 변환
        data.put("status", expense.getStatus().toString());
        data.put("isFixedExpense", expense.getStatus().toString().equals("APPROVED"));
        
        // 평균 거래 간격은 없으므로 기본값 추가
        data.put("avgInterval", 30.0); // 기본값으로 한 달 (30일)
        
        return data;
    }
}