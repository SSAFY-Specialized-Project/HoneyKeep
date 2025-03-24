package com.barcode.honeykeep.fixedexpense.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum FixedExpenseErrorCode implements ErrorCode {
    FIXED_EXPENSE_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 고정 지출이 존재하지 않습니다.")
    ;

    private final HttpStatus httpStatus;
    private final String message;

    FixedExpenseErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
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
