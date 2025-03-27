package com.barcode.honeykeep.mydataConnect.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum MydataErrorCode implements ErrorCode {

    TOKEN_NOT_FOUND(HttpStatus.UNAUTHORIZED, "유효하지 않은 연동 토큰입니다."),
    ACCOUNT_AUTH_FAILED(HttpStatus.BAD_REQUEST, "1원 인증 요청에 실패했습니다."),
    ACCOUNT_DETAIL_FETCH_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "계좌 상세 정보를 가져오지 못했습니다."),
    BANK_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 은행을 찾을 수 없습니다."),
    TRANSACTION_FETCH_FAILED(HttpStatus.BAD_GATEWAY, "거래내역 조회에 실패했습니다.");
    ;

    private final HttpStatus httpStatus;
    private final String message;

    MydataErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
