package com.barcode.honeykeep.category.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CategoryErrorCode implements ErrorCode {

    // 400 Bad Request
    DUPLICATE_CATEGORY_NAME(HttpStatus.BAD_REQUEST, "이미 존재하는 카테고리 이름입니다"),
    EMPTY_REQUEST_DATA(HttpStatus.BAD_REQUEST, "요청 데이터가 비어있습니다"),
    INVALID_CATEGORY_NAME(HttpStatus.BAD_REQUEST, "카테고리 이름은 비어있을 수 없습니다"),

    // 404 Not Found
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 카테고리를 찾을 수 없습니다");


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