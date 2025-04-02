package com.barcode.honeykeep.chatbot.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import org.springframework.http.HttpStatus;

public enum ChatbotErrorCode implements ErrorCode {
    JSON_PARSE_ERROR(HttpStatus.BAD_REQUEST, "JSON 파싱 중 오류가 발생했습니다."),
    CHATBOT_CLIENT_ERROR(HttpStatus.BAD_GATEWAY, "챗봇 클라이언트 호출 중 오류가 발생했습니다."),
    INVALID_QUERY(HttpStatus.BAD_REQUEST, "유효하지 않은 쿼리입니다."),
    UNEXPECTED_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "예상치 못한 오류가 발생했습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    ChatbotErrorCode( HttpStatus status, String message) {
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
