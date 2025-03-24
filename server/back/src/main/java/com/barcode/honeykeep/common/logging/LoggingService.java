package com.barcode.honeykeep.common.logging;

import java.math.BigDecimal;
import java.net.InetAddress;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.barcode.honeykeep.common.vo.UserId;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

/**
 * 애플리케이션 전반에 걸쳐 구조화된 로깅을 제공하는 서비스 클래스임.
 * 여러 카테고리(사용자, 거래, 인증, API, 오류)의 로그를 JSON 형식으로 기록함.
 * MDC(Mapped Diagnostic Context)를 사용해서 로그에 컨텍스트 정보를 추가함.
 * ELK 스택과의 호환성을 고려한 구조화 로깅 제공.
 */
@Component
@Slf4j
public class LoggingService {
    // 특정 로거 객체들
    private static final Logger userLogger = LoggerFactory.getLogger("com.barcode.honeykeep.user");
    private static final Logger transactionLogger = LoggerFactory.getLogger("com.barcode.honeykeep.transaction");
    private static final Logger authLogger = LoggerFactory.getLogger("com.barcode.honeykeep.auth");
    private static final Logger apiLogger = LoggerFactory.getLogger("com.barcode.honeykeep.api");
    private static final Logger errorLogger = LoggerFactory.getLogger("com.barcode.honeykeep.error");
    
    private static String hostname;
    
    // 호스트명을 초기화
    static {
        try {
            hostname = InetAddress.getLocalHost().getHostName();
        } catch (Exception e) {
            hostname = "unknown";
        }
    }
    
    /**
     * MDC에 공통 필드를 설정
     */
    private void setCommonFields() {
        String traceId = getOrGenerateTraceId();
        MDC.put("traceId", traceId);
        MDC.put("hostname", hostname);
        MDC.put("requestId", getOrGenerateRequestId());
    }

    /**
     * 현재 요청의 traceId를 가져오거나 새로 생성
     */
    private String getOrGenerateTraceId() {
        String traceId = MDC.get("traceId");
        if (traceId == null || traceId.isEmpty()) {
            traceId = UUID.randomUUID().toString().replace("-", "");
        }
        return traceId;
    }
    
    /**
     * 현재 요청의 requestId를 가져오거나 새로 생성함
     */
    private String getOrGenerateRequestId() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String requestId = (String) request.getAttribute("requestId");
            if (requestId != null) {
                return requestId;
            }
        } catch (Exception e) {
            // 요청 컨텍스트가 없는 경우 무시
        }
        
        return UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * 사용자 활동에 대한 로그를 기록함.
     * 
     * @param userId 사용자 식별자
     * @param action 수행된 작업 (예: "프로필 업데이트", "계정 설정 변경")
     * @param details 활동에 대한 상세 설명
     */
    public void logUserActivity(Integer userId, String action, String details) {
        setCommonFields();
        MDC.put("userId", userId.toString());
        MDC.put("action", action);
        MDC.put("clientIp", getCurrentIp());

        userLogger.info(details);

        MDC.clear();
    }

    /**
     * 금융 거래에 대한 로그를 기록함.
     * 
     * @param transactionId 거래 식별자
     * @param userId 사용자 식별자
     * @param amount 거래 금액
     * @param action 거래 유형 (예: "입금", "출금", "이체")
     * @param details 거래에 대한 상세 설명
     */
    public void logTransaction(String transactionId, Integer userId, BigDecimal amount, String action, String details) {
        setCommonFields();
        MDC.put("transactionId", transactionId);
        MDC.put("userId", userId.toString());
        MDC.put("amount", amount.toString());
        MDC.put("action", action);
        MDC.put("clientIp", getCurrentIp());

        transactionLogger.info(details);

        MDC.clear();
    }
    
    /**
     * 기존 호환성을 위한 메서드
     */
    public void logTransaction(String transactionId, Integer userId, BigDecimal amount, String details) {
        logTransaction(transactionId, userId, amount, "transaction", details);
    }

    /**
     * 인증 관련 활동에 대한 로그를 기록함.
     * 
     * @param userId 사용자 식별자 (없는 경우 null)
     * @param clientIp 클라이언트 IP 주소
     * @param userAgent 사용자 에이전트 문자열
     * @param action 인증 작업 유형 (예: "로그인", "로그아웃", "패스워드 변경")
     * @param details 인증 활동에 대한 상세 설명
     */
    public void logAuth(Integer userId, String clientIp, String userAgent, String action, String details) {
        setCommonFields();
        MDC.put("userId", userId != null ? userId.toString() : "anonymous");
        MDC.put("clientIp", clientIp);
        MDC.put("userAgent", userAgent);
        MDC.put("action", action);

        authLogger.info(details);

        MDC.clear();
    }
    
    /**
     * 기존 호환성을 위한 메서드
     */
    public void logAuth(Integer userId, String ip, String userAgent, String details) {
        logAuth(userId, ip, userAgent, "auth", details);
    }

    /**
     * API 호출에 대한 로그를 기록함.
     * 
     * @param method HTTP 메서드 (GET, POST, PUT, DELETE 등)
     * @param path 요청 경로
     * @param responseTime 응답 시간 (밀리초)
     * @param statusCode HTTP 상태 코드
     * @param details API 호출에 대한 상세 설명
     * @param userId 인증된 사용자 ID (인증되지 않은 경우 null)
     * @param requestId 요청 추적을 위한 고유 ID
     * @param clientIp 클라이언트 IP 주소
     * @param userAgent 사용자 에이전트 정보
     * @param contentType 요청 컨텐츠 타입
     * @param requestPayloadSummary 요청 본문 요약 (선택적)
     * @param responsePayloadSummary 응답 본문 요약 (선택적)
     * @param action API 작업 유형 (예: "조회", "생성", "수정", "삭제")
     */
    public void logApiCall(String method, String path, long responseTime, int statusCode, String details,
                           UserId userId, String requestId, String clientIp, String userAgent,
                           String contentType, String requestPayloadSummary, String responsePayloadSummary, String action) {
        setCommonFields();
        MDC.put("method", method);
        MDC.put("path", path);
        MDC.put("responseTime", String.valueOf(responseTime));
        MDC.put("statusCode", String.valueOf(statusCode));
        MDC.put("userId", userId != null ? userId.toString() : "anonymous");
        MDC.put("requestId", requestId);
        MDC.put("clientIp", clientIp);
        MDC.put("userAgent", userAgent);
        MDC.put("contentType", contentType);
        MDC.put("action", action);
        
        if (requestPayloadSummary != null && !requestPayloadSummary.isEmpty()) {
            MDC.put("requestPayload", requestPayloadSummary);
        }
        
        if (responsePayloadSummary != null && !responsePayloadSummary.isEmpty()) {
            MDC.put("responsePayload", responsePayloadSummary);
        }

        apiLogger.info(details);

        MDC.clear();
    }
    
    /**
     * 기존 호환성을 위한 메서드
     */
    public void logApiCall(String method, String path, long responseTime, int statusCode, String details,
                           UserId userId, String requestId, String clientIp, String userAgent,
                           String contentType, String requestPayloadSummary, String responsePayloadSummary) {
        String action = method.equalsIgnoreCase("GET") ? "조회" : 
                        method.equalsIgnoreCase("POST") ? "생성" : 
                        method.equalsIgnoreCase("PUT") ? "수정" : 
                        method.equalsIgnoreCase("DELETE") ? "삭제" : "기타";
        
        logApiCall(method, path, responseTime, statusCode, details, 
                   userId, requestId, clientIp, userAgent, contentType, 
                   requestPayloadSummary, responsePayloadSummary, action);
    }
    
    /**
     * 기존 API 호출에 대한 로그를 기록함. 
     * 하위 호환성을 위해 유지함.
     */
    public void logApiCall(String method, String path, long responseTime, int statusCode, String details) {
        logApiCall(method, path, responseTime, statusCode, details, 
                   null, getOrGenerateRequestId(), getCurrentIp(), "unknown", "unknown", null, null);
    }

    /**
     * 오류 발생에 대한 로그를 기록함.
     * 
     * @param errorCode 오류 코드
     * @param errorMessage 오류 메시지
     * @param exception 발생한 예외 객체 (없는 경우 null)
     * @param action 오류 작업 유형 (예: "DB_ERROR", "API_ERROR", "VALIDATION_ERROR")
     */
    public void logError(String errorCode, String errorMessage, Throwable exception, String action) {
        setCommonFields();
        MDC.put("errorCode", errorCode);
        MDC.put("errorMessage", errorMessage);
        MDC.put("action", action);

        // 현재 사용자 정보가 있으면 추가
        try {
            HttpServletRequest request =
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            MDC.put("requestUrl", request.getRequestURI());
            MDC.put("clientIp", request.getRemoteAddr());
        } catch (Exception e) {
            // 요청 컨텍스트가 없는 경우 무시
        }

        if (exception != null) {
            errorLogger.error("오류 발생: " + errorMessage, exception);
        } else {
            errorLogger.error("오류 발생: " + errorMessage);
        }

        MDC.clear();
    }

    /**
     * 기존 호환성을 위한 메서드
     */
    public void logError(String errorCode, String errorMessage, Throwable exception) {
        logError(errorCode, errorMessage, exception, "ERROR");
    }

    /**
     * 예외 객체 없이 오류에 대한 로그를 기록함.
     * 
     * @param errorCode 오류 코드
     * @param errorMessage 오류 메시지
     */
    public void logError(String errorCode, String errorMessage) {
        logError(errorCode, errorMessage, null, "ERROR");
    }

    /**
     * 현재 요청의 클라이언트 IP 주소를 반환함.
     * 
     * @return 클라이언트 IP 주소, 요청 컨텍스트가 없으면 "unknown"
     */
    private String getCurrentIp() {
        try {
            HttpServletRequest request =
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            return extractClientIp(request);
        } catch (Exception e) {
            return "unknown";
        }
    }
    
    /**
     * 클라이언트의 실제 IP 주소를 추출함.
     * 
     * @param request HTTP 요청
     * @return 클라이언트 IP 주소
     */
    private String extractClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    /**
     * 인증 관련 이벤트 로깅
     * 
     * @param userId 사용자 ID
     * @param action 액션 (로그인, 로그아웃 등)
     * @param details 추가 세부 정보
     */
    public void logAuthEvent(Integer userId, String action, String details) {
        setCommonFields();
        MDC.put("userId", String.valueOf(userId));
        MDC.put("action", action);
        
        // 클라이언트 IP와 userAgent 정보 추가 시도
        try {
            HttpServletRequest request = 
                ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            MDC.put("clientIp", extractClientIp(request));
            MDC.put("userAgent", request.getHeader("User-Agent"));
        } catch (Exception e) {
            // 요청 컨텍스트가 없는 경우 무시
        }
        
        if (details != null) {
            MDC.put("details", details);
        }
        
        authLogger.info("인증 이벤트: {}", action);
        MDC.clear();
    }
}