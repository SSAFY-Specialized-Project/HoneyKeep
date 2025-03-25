package com.barcode.honeykeep.auth.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = jwtTokenProvider.resolveToken(request);
        String uri = request.getRequestURI();
        String method = request.getMethod();
        String query = request.getQueryString();

        // 디버깅을 위한 로그 추가
        System.out.println("Request URI: " + uri);
        System.out.println("Request Method: " + method);
        System.out.println("Token present: " + (token != null));

        // OPTIONS 요청은 항상 허용
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("[JwtAuthenticationFilter] URI: " + uri);

        // 인증이 필요없는 URI 패턴 목록
        List<String> permitAllUriPatterns = Arrays.asList(
                "/favicon.ico",
                "/api/v1/auth/register",
                "/api/v1/auth/login",
                "/api/v1/auth/send-verification",
                "/api/v1/auth/verify-email",
                "/api/v1/auth/validate-user",
                "/api/v1/sample/**",
                "/api/v1/auth/reissue",
                "/actuator/health",
                "/actuator/info"
        );

        // 패턴 매칭 확인 (경로 와일드카드 처리)
        AntPathMatcher pathMatcher = new AntPathMatcher();
        boolean isSkipTarget = permitAllUriPatterns.stream()
                .anyMatch(pattern -> pathMatcher.match(pattern, uri));

        // 스킵 대상이면, 토큰이 유효하다면 userId만 request에 설정하고 필터 계속 진행
        if (isSkipTarget) {
            if (token != null && jwtTokenProvider.validateToken(token)) {
                Long userId = jwtTokenProvider.getUserId(token);
                request.setAttribute("userId", userId);
            }
            // 토큰이 없거나 유효하지 않아도 스킵하므로 그대로 통과
            filterChain.doFilter(request, response);
            return;
        }

        // 스킵 대상이 아닌 경우 -> 토큰 검증
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // 토큰이 유효하면 SecurityContext 에 등록
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);

            // 컨트롤러에서 userId 참조할 수 있도록 request 에도 설정
            Long userId = jwtTokenProvider.getUserId(token);
            request.setAttribute("userId", userId);
            request.setAttribute("token", token);

            System.out.println("in JwtAuthenticationFilter: userId = " + userId);

        } else if (token == null) {
            // 토큰이 아예 없음
            AuthErrorCode errorCode = AuthErrorCode.MISSING_JWT_TOKEN;
            SecurityContextHolder.clearContext();

            String errorResponseBody = String.format(
                    "{" +
                            " \"status\": %d," +
                            " \"name\": \"%s\"," +
                            " \"message\": \"%s\"" +
                            "}",
                    errorCode.getHttpStatus().value(),
                    errorCode.name(),
                    errorCode.getMessage()
            );

            response.setStatus(errorCode.getHttpStatus().value());
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write(errorResponseBody);
            return;

        } else if (uri.startsWith("/api/auth/reissue")) {
            // 토큰이 만료된 상태에서 /api/auth/reissue 로 재발급 시도하는 경우
            Long userId = jwtTokenProvider.getUserIdFromExpiredToken(token);
            request.setAttribute("userId", userId);

        } else {
            // 그 외 토큰 만료, 위조 등
            AuthErrorCode errorCode = AuthErrorCode.JWT_TOKEN_EXPIRED;
            SecurityContextHolder.clearContext();

            String errorResponseBody = String.format(
                    "{" +
                            " \"status\": %d," +
                            " \"name\": \"%s\"," +
                            " \"message\": \"%s\"" +
                            "}",
                    errorCode.getHttpStatus().value(),
                    errorCode.name(),
                    errorCode.getMessage()
            );

            response.setStatus(errorCode.getHttpStatus().value());
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write(errorResponseBody);
            return;
        }

        // 9. 모든 검증 통과 후 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}