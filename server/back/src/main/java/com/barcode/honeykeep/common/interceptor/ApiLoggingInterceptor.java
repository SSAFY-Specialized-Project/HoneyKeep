package com.barcode.honeykeep.common.interceptor;

import java.util.Enumeration;
import java.util.UUID;
import java.net.InetAddress;

import com.barcode.honeykeep.common.service.LoggingService;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.barcode.honeykeep.common.vo.UserId;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * API 요청의 실행 시간 및 결과를 로깅하는 인터셉터임.
 *
 * <p>모든 API 요청에 대해 메서드, 경로, 응답 시간, 상태 코드를 포함한 구조화된 로그를 생성함.</p>
 * 
 * <p>이 인터셉터는 요청 처리가 시작될 때 타임스탬프를 저장하고, 요청 처리가 완료된 후
 * 응답 시간을 계산해서 로깅 서비스에 정보를 전달함.</p>
 * 
 * <p>애플리케이션의 WebMvcConfigurer에 등록해서 사용함.</p>
 * 
 * <p>ELK 스택과의 호환성을 위해 traceId와 requestId를 생성하고 요청에 첨부함.</p>
 */
@Component
@RequiredArgsConstructor
public class ApiLoggingInterceptor implements HandlerInterceptor {

    private final LoggingService loggingService;
    private static final String START_TIME = "startTime";
    private static final String REQUEST_ID = "requestId";
    private static final String TRACE_ID = "traceId";
    
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
     * 컨트롤러 메서드 실행 전에 호출되며, 요청 시작 시간을 저장함.
     * 또한 traceId와 requestId를 생성하여 MDC와 요청 속성에 저장함.
     * 
     * @param request 현재 HTTP 요청
     * @param response 현재 HTTP 응답
     * @param handler 실행될 핸들러
     * @return true면 요청 처리를 계속 진행, false면 중단
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        request.setAttribute(START_TIME, System.currentTimeMillis());
        
        // 요청에서 traceId가 있는지 확인 (마이크로서비스 간 통신 시 전달될 수 있음)
        String traceId = request.getHeader("X-Trace-ID");
        if (traceId == null || traceId.isEmpty()) {
            traceId = UUID.randomUUID().toString().replace("-", "");
        }
        
        // 요청 추적을 위한 고유 ID 생성 및 저장
        String requestId = UUID.randomUUID().toString().replace("-", "");
        
        // 요청 속성에 저장
        request.setAttribute(REQUEST_ID, requestId);
        request.setAttribute(TRACE_ID, traceId);
        
        // MDC에 저장 (로깅에 사용됨)
        MDC.put("traceId", traceId);
        MDC.put("requestId", requestId);
        MDC.put("hostname", hostname);
        
        // 응답 헤더에 ID 추가 (분산 추적용)
        response.setHeader("X-Request-ID", requestId);
        response.setHeader("X-Trace-ID", traceId);
        
        return true;
    }

    /**
     * 요청 처리가 완전히 완료된 후 호출되며, API 호출에 대한 로그를 기록함.
     * 시작 시간과 현재 시간의 차이를 계산해서 응답 시간을 측정함.
     * 
     * @param request 현재 HTTP 요청
     * @param response 현재 HTTP 응답
     * @param handler 실행된 핸들러
     * @param ex 발생한 예외(있는 경우)
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        long startTime = (long) request.getAttribute(START_TIME);
        long responseTime = System.currentTimeMillis() - startTime;
        String requestId = (String) request.getAttribute(REQUEST_ID);
        String traceId = (String) request.getAttribute(TRACE_ID);
        
        // 사용자 인증 정보 추출
        UserId userId = extractUserId();
        
        // 클라이언트 정보
        String clientIp = extractClientIp(request);
        String userAgent = request.getHeader("User-Agent");
        String contentType = request.getContentType();
        
        // 핸들러 메소드 정보
        String handlerInfo = extractHandlerInfo(handler);
        
        // 요청 및 응답 요약 (실제 구현에서는 민감한 정보 필터링 필요)
        String requestPayloadSummary = summarizeRequestPayload(request);
        String responsePayloadSummary = summarizeResponsePayload(response);
        
        // HTTP 메소드에 따른 적절한 액션 결정
        String method = request.getMethod();
        String action = method.equalsIgnoreCase("GET") ? "조회" : 
                        method.equalsIgnoreCase("POST") ? "생성" : 
                        method.equalsIgnoreCase("PUT") ? "수정" : 
                        method.equalsIgnoreCase("DELETE") ? "삭제" : "기타";

        loggingService.logApiCall(
                method,
                request.getRequestURI(),
                responseTime,
                response.getStatus(),
                "API 호출 완료: " + handlerInfo,
                userId,
                requestId,
                clientIp,
                userAgent,
                contentType,
                requestPayloadSummary,
                responsePayloadSummary,
                action
        );
        
        // 오류가 있는 경우 오류 로깅
        if (ex != null) {
            loggingService.logError("API_ERROR", "API 처리 중 오류 발생: " + ex.getMessage(), ex, "API_ERROR");
        }
        
        // 요청이 완료되면 MDC 정리
        MDC.clear();
    }
    
    /**
     * 현재 인증된 사용자의 ID를 추출함.
     * 
     * @return 인증된 사용자 ID 또는 null
     */
    private UserId extractUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getPrincipal().equals("anonymousUser")) {
                
                // Principal 객체 타입에 따라 ID 추출
                Object principal = authentication.getPrincipal();
                
                // Principal이 UserId 객체인지 확인.
                if (principal instanceof UserId) {
                    return (UserId) principal;
                }
            }
        } catch (Exception e) {
            // 오류 발생 시 조용히 처리
        }
        return null;
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
     * 핸들러 메소드 정보를 추출함.
     * 
     * @param handler 핸들러 객체
     * @return 핸들러 메소드 정보
     */
    private String extractHandlerInfo(Object handler) {
        if (handler instanceof HandlerMethod handlerMethod) {
            return handlerMethod.getBeanType().getSimpleName() + "." + handlerMethod.getMethod().getName();
        }
        return handler != null ? handler.toString() : "unknown";
    }
    
    /**
     * 요청 본문의 요약을 생성함.
     * 실제 구현에서는 민감한 정보를 필터링하는 로직이 필요함.
     * 
     * @param request HTTP 요청
     * @return 요청 본문 요약
     */
    private String summarizeRequestPayload(HttpServletRequest request) {
        // 여기에서는 간단한 구현만 제공함.
        // 실제 구현에서는 요청 본문을 읽고 요약하는 로직이 필요함.
        StringBuilder summary = new StringBuilder();
        
        // 요청 파라미터 추가
        Enumeration<String> paramNames = request.getParameterNames();
        while (paramNames.hasMoreElements()) {
            String paramName = paramNames.nextElement();
            summary.append(paramName).append("=").append(maskSensitiveData(paramName, request.getParameter(paramName)));
            if (paramNames.hasMoreElements()) {
                summary.append(", ");
            }
        }
        
        return summary.toString();
    }
    
    /**
     * 응답 본문의 요약을 생성함.
     * 실제 구현에서는 응답 본문을 필터링하는 로직이 필요함.
     * 
     * @param response HTTP 응답
     * @return 응답 본문 요약
     */
    private String summarizeResponsePayload(HttpServletResponse response) {
        // 응답 본문을 요약하는 로직
        // 실제 구현에서는 응답 래퍼를 사용하여 응답 본문을 캡처하고 요약하는 로직이 필요함.
        return "응답 크기: " + response.getBufferSize() + " bytes";
    }
    
    /**
     * 민감한 데이터를 마스킹함.
     * 
     * @param fieldName 필드 이름
     * @param value 필드 값
     * @return 마스킹된 값
     */
    private String maskSensitiveData(String fieldName, String value) {
        if (value == null) {
            return "null";
        }
        
        // 민감한 필드 목록
        String[] sensitiveFields = {"password", "token", "secret", "key", "credential", "card", "cvv", "ssn"};
        
        for (String field : sensitiveFields) {
            if (fieldName.toLowerCase().contains(field)) {
                return !value.isEmpty() ? "******" : "";
            }
        }
        
        return value;
    }
}