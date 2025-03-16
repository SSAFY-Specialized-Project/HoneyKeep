//package com.barcode.honeykeep.auth.config;
//
//import java.io.IOException;
//
//import com.barcode.honeykeep.auth.util.JwtTokenProvider;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//public class JwtAuthenticationFilter extends OncePerRequestFilter {
//
//    private final JwtTokenProvider jwtTokenProvider;
//
//    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
//        this.jwtTokenProvider = jwtTokenProvider;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request,
//                                    HttpServletResponse response,
//                                    FilterChain filterChain) throws ServletException, IOException {
//
//        String token = jwtTokenProvider.resolveToken(request);
//        String uri = request.getRequestURI();
//        String method = request.getMethod();
//        String query = request.getQueryString();
//
//        // 디버깅을 위한 로그 추가
//        System.out.println("Request URI: " + uri);
//        System.out.println("Request Method: " + method);
//        System.out.println("Token present: " + (token != null));
//
//        // OPTIONS 요청은 항상 허용
//        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        System.out.println("[JwtAuthenticationFilter] URI: " + uri);
//
//        // 1. favicon 요청은 JWT 검증 건너뛰기
//        if ("/favicon.ico".equals(uri)) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 2. /api/auth/login/kakao, /api/auth/login/naver 요청은 JWT 검증 건너뛰기
//        if ("/api/auth/login/kakao".equals(uri) || "/api/auth/login/naver".equals(uri)) {
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 3. GET /api/challenges/me 를 제외한 모든 GET /api/challenges/** 요청은 스킵
//        boolean isGetChallenges = "GET".equalsIgnoreCase(method)
//                && uri.matches("^/api/challenges(?:(?!/me).)*$");
//
//        // 4. GET /api/feed, GET /api/posts/{postId}, GET /api/posts/{postId}/comments/{commentId} 스킵
//        boolean isGetPosts = ("GET".equalsIgnoreCase(method))
//                && (uri.startsWith("/api/feed") || uri.matches("^/api/posts/\\d+$") || uri.matches("^/api/posts/\\d+/comments"));
//
//        // 5. GET /api/users/{userId}/posts, /api/users/{userId}/profile 스킵
//        boolean isGetUsers = ("GET".equalsIgnoreCase(method))
//                && (uri.matches("^/api/users/\\d+/posts$") || uri.matches("^/api/users/\\d+/profile$"));
//
//        // 6. /api/rankings/** 여러 GET 요청 스킵
//        boolean isGetRankings = ("GET".equalsIgnoreCase(method)) && (
//                (uri.matches("^/api/rankings/exp/\\d+$") || uri.matches("^/api/rankings/similarity/\\d+$")) ||
//                        (uri.matches("^/api/rankings/\\d+/similarity$")  || (uri.matches("^/api/rankings/exp$") || uri.matches("^/api/rankings/similarity$")) &&
//                                (query == null
//                                        || query.matches("^(.*?&)?page=\\d+(&.*)?$")
//                                        || query.matches("^(.*?&)?size=\\d+(&.*)?$")
//                                        || query.matches("^(.*?&)?page=\\d+&size=\\d+(&.*)?$"))
//                        ));
//
//        // 7. /api/challenges/similarity-result 로 시작하는 요청은 Python 서버에서 오는 것 -> 스킵
//        boolean isRequestFromPythonServer = uri.startsWith("/api/challenges/similarity-result");
//
//        boolean isSkipTarget = isGetChallenges || isGetPosts || isGetUsers || isGetRankings || isRequestFromPythonServer;
//        System.out.println("[JwtAuthenticationFilter] method: " + method);
//        System.out.println("[JwtAuthenticationFilter] uri: " + uri);
//        System.out.println("[JwtAuthenticationFilter] query: " + query);
//        System.out.println("[JwtAuthenticationFilter] isGetChallenges: " + isGetChallenges);
//        System.out.println("[JwtAuthenticationFilter] isGetPosts: " + isGetPosts);
//        System.out.println("[JwtAuthenticationFilter] isGetRankings: " + isGetRankings);
//        System.out.println("[JwtAuthenticationFilter] isRequestFromPythonServer: " + isRequestFromPythonServer);
//        System.out.println("[JwtAuthenticationFilter] isSkipTarget: " + isSkipTarget);
//
//        // 스킵 대상이면, 토큰이 유효하다면 userId만 request에 설정하고 필터 계속 진행
//        if (isSkipTarget) {
//            if (token != null && jwtTokenProvider.validateToken(token)) {
//                Long userId = jwtTokenProvider.getUserId(token);
//                request.setAttribute("userId", userId);
//            }
//            // 토큰이 없거나 유효하지 않아도 스킵하므로 그대로 통과
//            filterChain.doFilter(request, response);
//            return;
//        }
//
//        // 8. 스킵 대상이 아닌 경우 -> 토큰 검증
//        if (token != null && jwtTokenProvider.validateToken(token)) {
//            // 토큰이 유효하면 SecurityContext 에 등록
//            Authentication auth = jwtTokenProvider.getAuthentication(token);
//            SecurityContextHolder.getContext().setAuthentication(auth);
//
//            // 컨트롤러에서 userId 참조할 수 있도록 request 에도 설정
//            Long userId = jwtTokenProvider.getUserId(token);
//            request.setAttribute("userId", userId);
//            request.setAttribute("token", token);
//
//            System.out.println("in JwtAuthenticationFilter: userId = " + userId);
//
//        } else if (token == null) {
//            // 토큰이 아예 없음
//            AuthErrorCode errorCode = AuthErrorCode.MISSING_JWT_TOKEN;
//            SecurityContextHolder.clearContext();
//
//            String errorResponseBody = String.format(
//                    "{" +
//                            " \"status\": %d," +
//                            " \"name\": \"%s\"," +
//                            " \"message\": \"%s\"" +
//                            "}",
//                    errorCode.getHttpStatus().value(),
//                    errorCode.name(),
//                    errorCode.getMessage()
//            );
//
//            response.setStatus(errorCode.getHttpStatus().value());
//            response.setContentType("application/json; charset=UTF-8");
//            response.getWriter().write(errorResponseBody);
//            return;
//
//        } else if (uri.startsWith("/api/auth/reissue")) {
//            // 토큰이 만료된 상태에서 /api/auth/reissue 로 재발급 시도하는 경우
//            Long userId = jwtTokenProvider.getUserIdFromExpiredToken(token);
//            request.setAttribute("userId", userId);
//
//        } else {
//            // 그 외 토큰 만료, 위조 등
//            AuthErrorCode errorCode = AuthErrorCode.JWT_TOKEN_EXPIRED;
//            SecurityContextHolder.clearContext();
//
//            String errorResponseBody = String.format(
//                    "{" +
//                            " \"status\": %d," +
//                            " \"name\": \"%s\"," +
//                            " \"message\": \"%s\"" +
//                            "}",
//                    errorCode.getHttpStatus().value(),
//                    errorCode.name(),
//                    errorCode.getMessage()
//            );
//
//            response.setStatus(errorCode.getHttpStatus().value());
//            response.setContentType("application/json; charset=UTF-8");
//            response.getWriter().write(errorResponseBody);
//            return;
//        }
//
//        // 9. 모든 검증 통과 후 다음 필터로 진행
//        filterChain.doFilter(request, response);
//    }
//}