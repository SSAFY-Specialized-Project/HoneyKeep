package com.barcode.honeykeep.cert.exception;

import com.barcode.honeykeep.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum CertErrorCode implements ErrorCode {

    CERTIFICATE_ALREADY_EXISTS(HttpStatus.CONFLICT, "인증서가 이미 존재합니다."),
    INVALID_PUBLIC_KEY(HttpStatus.BAD_REQUEST, "유효하지 않은 공개키 형식입니다."),
    CERTIFICATE_NOT_FOUND(HttpStatus.NOT_FOUND, "인증서를 찾을 수 없습니다."),
    CERTIFICATE_EXPIRED(HttpStatus.FORBIDDEN, "인증서가 만료되었습니다."),
    CERTIFICATE_GENERATION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "인증서 생성에 실패했습니다."),
    SIGNATURE_VERIFICATION_FAILED(HttpStatus.BAD_REQUEST, "서명 검증에 실패했습니다.");

    private final HttpStatus httpStatus;
    private final String message;

    @Override
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
