package com.barcode.honeykeep.transaction.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TransactionErrorCode implements ErrorCode {
    // 400 Bad Request
    INVALID_ACCOUNT_ID(HttpStatus.BAD_REQUEST, "유효하지 않은 계좌 ID입니다"),

    // 404 Not Found
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 거래내역을 찾을 수 없습니다"),
    ACCOUNT_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 계좌를 찾을 수 없습니다");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public HttpStatus getHttpStatus() {
        return this.httpStatus;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}