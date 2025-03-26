package com.barcode.honeykeep.account.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum AccountErrorCode implements ErrorCode {
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 계좌를 찾을 수 없습니다."),
    ACCOUNT_ACCESS_DENIED(HttpStatus.FORBIDDEN, "해당 계좌에 접근할 권한이 없습니다.");


    private final HttpStatus httpStatus;
    private final String message;

    AccountErrorCode( HttpStatus status, String message) {
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
