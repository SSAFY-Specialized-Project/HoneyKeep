package com.barcode.honeykeep.common.exception;

import lombok.Builder;
import lombok.Data;
import org.springframework.http.ResponseEntity;

@Data
@Builder
public class ErrorResponseEntity {
    private int status;
    private String name;
    private String message;

    public static ResponseEntity<ErrorResponseEntity> toResponseEntity(ErrorCode errorCode) {
        return ResponseEntity.status(errorCode.getHttpStatus())
                .body(ErrorResponseEntity.builder()
                        .status(errorCode.getHttpStatus().value())
                        .name(errorCode.toString())
                        .message(errorCode.getMessage())
                        .build());
    }
}
