package com.barcode.honeykeep.transaction.dto;

import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Builder
public record TransactionListResponse(
        List<Transaction> transactions
) {
    @Builder
    public record Transaction(
            Long id,
            String name,
            Long amount,
            Long balance,
            LocalDateTime date,
            TransactionType type,
            Long pocketId // 포켓 분석 시 계획 소비 판별을 위해 포켓 아이디를 응답 dto에 추가
    ) {}
}