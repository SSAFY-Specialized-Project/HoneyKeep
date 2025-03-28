package com.barcode.honeykeep.pay.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum PayErrorCode implements ErrorCode {
    INVALID_QR(HttpStatus.NOT_FOUND, "유효하지 않은 QR코드입니다."),
    ALREADY_USED_QR(HttpStatus.NOT_FOUND, "이미 사용한 QR코드입니다."),
    INVALID_ACCOUNT(HttpStatus.NOT_FOUND, "존재하지 않는 계좌입니다."),
    INSUFFICIENT_BALANCE(HttpStatus.FORBIDDEN, "잔액을 초과했습니다."),
    INVALID_POCKET(HttpStatus.NOT_FOUND, "존재하지 않는 포켓입니다."),;

    private final HttpStatus httpStatus;
    private final String message;

    PayErrorCode( HttpStatus status, String message) {
        this.httpStatus = status;
        this.message = message;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return this.httpStatus;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
