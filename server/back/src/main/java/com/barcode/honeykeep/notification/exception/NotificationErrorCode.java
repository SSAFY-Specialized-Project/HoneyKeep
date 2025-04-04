package com.barcode.honeykeep.notification.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum NotificationErrorCode implements ErrorCode {
    SERVICE_ACCOUNT_KEY_NOT_FOUND(HttpStatus.NOT_FOUND, "Firebase 서비스 계정 키 파일을 찾을 수 없습니다."),
    UNSUPPORTED_NOTIFICATION_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 알림 유형입니다.");;


    private final HttpStatus httpStatus;
    private final String message;

    NotificationErrorCode(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    @Override
    public HttpStatus getHttpStatus() {
        return null;
    }

    @Override
    public String getMessage() {
        return "";
    }
}
