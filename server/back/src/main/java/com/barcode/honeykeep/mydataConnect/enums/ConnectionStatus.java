package com.barcode.honeykeep.mydataConnect.enums;

public enum ConnectionStatus {
    /**
     * 기관 연동이 시작되었으나 아직 완료되지 않은 상태
     */
    PENDING,

    /**
     * 인증서 발급, 1원 인증 등 모든 절차가 완료된 상태
     */
    CONNECTED,

    /**
     * 중간에 인증 실패 등으로 인해 연동이 실패한 상태
     */
    FAILED
}

