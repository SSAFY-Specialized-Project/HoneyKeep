package com.barcode.honeykeep.auth.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum AuthErrorCode implements ErrorCode {

    JWT_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "JWT token expired"),
    MISSING_JWT_TOKEN(HttpStatus.UNAUTHORIZED, "JWT token is required"),
    REFRESH_TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "Refresh token expired"),
    MISSING_REFRESH_TOKEN(HttpStatus.BAD_REQUEST, "Refresh token is required"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "User not found"),

    ;

    private final HttpStatus httpStatus;
    private final String message;

    AuthErrorCode(HttpStatus httpStatus, String message) {
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
