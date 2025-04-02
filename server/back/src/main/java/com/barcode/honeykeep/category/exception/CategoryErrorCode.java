package com.barcode.honeykeep.category.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CategoryErrorCode implements ErrorCode {
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 카테고리를 찾을 수 없습니다");

    private final HttpStatus httpStatus;
    private final String message;
}