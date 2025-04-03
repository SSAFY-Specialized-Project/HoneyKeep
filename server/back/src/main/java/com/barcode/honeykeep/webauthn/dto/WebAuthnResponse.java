package com.barcode.honeykeep.webauthn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * WebAuthn 응답 클래스
 * WebAuthn 작업의 결과를 클라이언트에 반환하기 위한 공통 응답 형식
 *
 * @param <T> 응답 데이터 타입
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebAuthnResponse<T> {
    
    /**
     * 요청 성공 여부
     */
    private boolean success;
    
    /**
     * 응답 메시지
     */
    private String message;
    
    /**
     * 응답 데이터
     */
    private T data;
    
    /**
     * 세션 ID (등록/인증 시작 시에 사용)
     */
    private String sessionId;
    
    /**
     * 성공 응답 생성 (메시지 없음)
     */
    public static <T> WebAuthnResponse<T> success(T data) {
        return WebAuthnResponse.<T>builder()
                .success(true)
                .data(data)
                .build();
    }

    /**
     * 성공 응답 생성 (메시지 포함)
     */
    public static <T> WebAuthnResponse<T> success(String message, T data) {
        return WebAuthnResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
    }

    /**
     * 성공 응답 생성 (세션 ID 포함)
     */
    public static <T> WebAuthnResponse<T> success(T data, String sessionId) {
        return WebAuthnResponse.<T>builder()
                .success(true)
                .data(data)
                .sessionId(sessionId)
                .build();
    }

    /**
     * 오류 응답 생성 (메시지만)
     */
    public static <T> WebAuthnResponse<T> error(String message) {
        return WebAuthnResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
    }

    /**
     * 오류 응답 생성 (메시지 및 데이터)
     */
    public static <T> WebAuthnResponse<T> error(String message, T data) {
        return WebAuthnResponse.<T>builder()
                .success(false)
                .message(message)
                .data(data)
                .build();
    }
} 