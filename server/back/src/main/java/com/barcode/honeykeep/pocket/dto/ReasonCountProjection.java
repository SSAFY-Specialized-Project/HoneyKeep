package com.barcode.honeykeep.pocket.dto;

/**
 * 초과 원인별 카운트 결과를 위한 Projection 인터페이스
 */
public interface ReasonCountProjection {
    String label(); // reasonText의 별칭
    Long count();   // 그룹별 개수
}
