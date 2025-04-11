package com.barcode.honeykeep.transaction.dto;

import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record TransactionDetailResponse(
        Long id,
        String name,
        Long amount,
        Long balance,
        LocalDateTime date,
        TransactionType type,
        Long accountId,
        String accountName,
        String memo,
        Long pocketId // 거래 시 사용한 포켓 정보 보기 위해 추가
) {}