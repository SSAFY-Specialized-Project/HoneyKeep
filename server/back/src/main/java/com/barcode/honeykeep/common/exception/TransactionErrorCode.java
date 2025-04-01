package com.barcode.honeykeep.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum TransactionErrorCode implements ErrorCode {
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 거래내역을 찾을 수 없습니다");

    private final HttpStatus httpStatus;
    private final String message;
}