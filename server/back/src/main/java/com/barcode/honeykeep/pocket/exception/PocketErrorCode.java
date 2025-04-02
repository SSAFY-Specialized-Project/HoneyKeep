package com.barcode.honeykeep.pocket.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum PocketErrorCode implements ErrorCode {

    // 500 에러 코드
    CRAWLING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "크롤링 중 에러가 발생했습니다."),
    REDIS_SAVE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Redis 데이터 저장에서 에러가 발생했습니다."),
    PRICE_PARSING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "금액 파싱 중 에러가 발생했습니다."),

    // 404 Not Found
    POCKET_NOT_FOUND(HttpStatus.NOT_FOUND, "해당 ID의 포켓을 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    PocketErrorCode(HttpStatus status, String message) {
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