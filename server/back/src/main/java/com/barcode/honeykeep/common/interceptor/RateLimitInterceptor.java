package com.barcode.honeykeep.common.interceptor;

import com.barcode.honeykeep.common.service.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Profile("!test")
public class RateLimitInterceptor implements HandlerInterceptor {

    private final RateLimitService rateLimitService;

    @Autowired
    public RateLimitInterceptor(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 클라이언트 IP 가져오기
        String clientIp = getClientIp(request);
        
        // URI 가져오기
        String requestUri = request.getRequestURI();
        
        // API 카테고리 결정
        RateLimitService.ApiCategory category = rateLimitService.getCategoryFromUrl(requestUri);
        
        // rate limit 체크
        boolean allowed = rateLimitService.tryConsume(clientIp, category);
        
        if (!allowed) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");  
            response.getWriter().write("{\"message\":\"요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해주세요.\"}");
            return false;
        }
        
        // 남은 요청 수 헤더에 추가
        long availableTokens = rateLimitService.getAvailableTokens(clientIp, category);
        response.setHeader("X-RateLimit-Remaining", String.valueOf(availableTokens));
        
        return true;
    }
    
    private String getClientIp(HttpServletRequest request) {
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
}