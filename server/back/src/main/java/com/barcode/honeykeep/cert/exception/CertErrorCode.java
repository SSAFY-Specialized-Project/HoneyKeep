package com.barcode.honeykeep.cert.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum CertErrorCode implements ErrorCode {
    ;

    private final HttpStatus httpStatus;
    private final String message;

    CertErrorCode(HttpStatus httpStatus, String message) {
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
