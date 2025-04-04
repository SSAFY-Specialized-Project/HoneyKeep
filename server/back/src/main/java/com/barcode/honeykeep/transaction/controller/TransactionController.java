package com.barcode.honeykeep.transaction.controller;

import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.transaction.dto.TransactionDetailResponse;
import com.barcode.honeykeep.transaction.dto.TransactionListResponse;
import com.barcode.honeykeep.transaction.dto.TransactionMemoRequest;
import com.barcode.honeykeep.transaction.dto.TransactionMemoResponse;
import com.barcode.honeykeep.transaction.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * 거래내역 목록 조회
     * @param userId 인증된 사용자 ID
     * @param accountId 계좌 ID (선택 사항)
     * @return 거래내역 목록
     */
    @GetMapping
    public ResponseEntity<ApiResponse<TransactionListResponse>> getTransactions(
            @AuthenticationPrincipal UserId userId,
            @RequestParam Long accountId) {

        TransactionListResponse response = transactionService.getTransactions(userId.value(), accountId);

        return response == null || response.transactions() == null || response.transactions().isEmpty()
                ? ResponseEntity.ok()
                        .body(ApiResponse.noContent("해당 계좌의 거래내역이 없습니다", null))
                : ResponseEntity.ok()
                        .body(ApiResponse.success("거래내역 목록 조회 성공", response));
    }

    /**
     * 거래내역 상세 조회
     * @param userId 인증된 사용자 ID
     * @param id 거래내역 ID
     * @return 거래내역 상세 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDetailResponse>> getTransaction(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id) {

        TransactionDetailResponse response = transactionService.getTransaction(userId.value(), id);

        return ResponseEntity.ok()
                .body(ApiResponse.success("거래내역 상세 조회 성공", response));
    }

    /**
     * 거래내역 메모 업데이트
     * @param userId 인증된 사용자 ID
     * @param id 거래내역 ID
     * @param request 메모 업데이트 요청
     * @return 업데이트된 메모 정보
     */
    @Transactional
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionMemoResponse>> updateTransactionMemo(
            @AuthenticationPrincipal UserId userId,
            @PathVariable Long id,
            @RequestBody TransactionMemoRequest request) {

        TransactionMemoResponse response = transactionService.updateTransactionMemo(userId.value(), id, request);

        return ResponseEntity.ok()
                .body(ApiResponse.success("거래내역 메모 업데이트 성공", response));
    }
}