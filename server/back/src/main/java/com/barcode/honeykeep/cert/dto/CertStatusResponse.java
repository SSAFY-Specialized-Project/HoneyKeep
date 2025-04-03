package com.barcode.honeykeep.cert.dto;

import java.time.LocalDateTime;
import java.time.OffsetDateTime; // ISO 8601 형식의 날짜/시간 표현

/**
 * 사용자의 현재 인증서 상태 정보를 담는 DTO
 */
public record CertStatusResponse(
        /**
         * 인증서의 현재 상태.
         * "ACTIVE": 유효한 인증서 존재
         * "EXPIRED": 인증서가 존재하나 만료됨
         * "REVOKED": 인증서가 존재하나 폐기됨
         * "NONE": 사용자에게 등록된 인증서 없음
         */
        String status,

        /**
         * 인증서의 고유 시리얼 번호.
         * status가 "NONE"이 아닐 경우에만 값이 존재합니다. (Nullable)
         */
        String serialNumber,

        /**
         * 인증서의 만료 일시 (ISO 8601 형식).
         * status가 "ACTIVE", "EXPIRED", "REVOKED"일 경우에만 값이 존재합니다. (Nullable)
         */
        LocalDateTime expiryDate,

        /**
         * 인증서의 발급 일시 (ISO 8601 형식).
         * status가 "ACTIVE", "EXPIRED", "REVOKED"일 경우에만 값이 존재합니다. (Nullable)
         */
        LocalDateTime issueDate
) {
}