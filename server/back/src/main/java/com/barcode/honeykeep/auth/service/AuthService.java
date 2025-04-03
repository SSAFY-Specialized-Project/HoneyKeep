package com.barcode.honeykeep.auth.service;

import com.barcode.honeykeep.auth.dto.*;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.service.LoggingService;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final WebClient webClient = WebClient.create("https://finopenapi.ssafy.io/ssafy/api/v1");
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender mailSender;
    private final LoggingService loggingService;

    @Value("${SSAFY_FINANCIAL_NETWORK_API_KEY}")
    private String ssafyFinancialNetworkApiKey;

    /**
     * 사용자 회원가입 처리
     *
     * @param request
     * @return
     */
    @Transactional
    public RegisterResponse registerUser(RegisterRequest request) {
        User user = findUserOrRegisterAsync(request).block();

        if (Boolean.TRUE.equals(userRepository.existsUserByUserKey(user.getUserKey()))) {
            throw new CustomException(AuthErrorCode.USER_INFO_ALREADY_REGISTERED);
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        String encryptedIdNumber = encryptionService.encrypt(request.identityNumber());

        User newUser = User.builder()
                .userKey(user.getUserKey())
                .email(request.email())
                .name(request.name())
                .institutionCode(user.getInstitutionCode())
                .identityNumber(encryptedIdNumber)
                .password(encodedPassword)
                .phoneNumber(request.phoneNumber())
                .build();

        newUser = userRepository.save(newUser);

        // 회원가입 이벤트 로깅
        loggingService.logAuthEvent(
                newUser.getId(),
                "회원가입",
                String.format("신규 사용자 등록: %s (%s)", newUser.getEmail(), newUser.getName())
        );

        return RegisterResponse.toDto(newUser);
    }

    private Mono<User> findUserOrRegisterAsync(RegisterRequest request) {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("apiKey", ssafyFinancialNetworkApiKey);
        requestBody.put("userId", request.email());

        return webClient.post()
                .uri("/member/search/")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(User.class)
                .onErrorResume(WebClientResponseException.class, e -> {
                    if (e.getStatusCode().is4xxClientError() &&
                            e.getResponseBodyAsString().contains("E4003")) {
                        return webClient.post()
                                .uri("/member/")
                                .contentType(MediaType.APPLICATION_JSON)
                                .bodyValue(requestBody)
                                .retrieve()
                                .bodyToMono(User.class);
                    }
                    return Mono.error(e);
                });
    }

    /**
     * 사용자 로그인 처리
     */
    public TokenResponse authenticateUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> {
                    // 로그인 실패 - 사용자 없음 로깅
                    loggingService.logAuth(
                            null,
                            getClientIp(),
                            getUserAgent(),
                            "로그인_실패",
                            String.format("로그인 실패: 사용자 없음 (%s)", request.email())
                    );
                    return new CustomException(AuthErrorCode.USER_NOT_FOUND);
                });

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            // 로그인 실패 - 비밀번호 불일치 로깅
            loggingService.logAuth(
                    user.getId(),
                    getClientIp(),
                    getUserAgent(),
                    "로그인_실패",
                    String.format("로그인 실패: 비밀번호 불일치 (%s)", user.getEmail())
            );
            throw new CustomException(AuthErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());
        long refreshTokenExpiresIn = jwtTokenProvider.getRefreshTokenExpiresIn();

        String refreshTokenKey = "refresh_token:" + user.getId();
        redisTemplate.opsForValue().set(
                refreshTokenKey,
                refreshToken,
                refreshTokenExpiresIn,
                TimeUnit.MILLISECONDS
        );

        // 로그인 성공 로깅
        loggingService.logAuth(
                user.getId(),
                getClientIp(),
                getUserAgent(),
                "로그인_성공",
                String.format("로그인 성공: %s (%s)", user.getEmail(), user.getName())
        );

        return new TokenResponse(
                accessToken,
                refreshToken,
                refreshTokenExpiresIn
        );
    }

    /**
     * 이메일 인증 코드 발송
     */
    public EmailVerifyResponse sendVerification(EmailVerifyRequest request) throws UnsupportedEncodingException {
        if (request.email() == null || request.email().isEmpty()) {
            throw new CustomException(AuthErrorCode.INVALID_EMAIL);
        }

        Random random = new SecureRandom();
        String verificationCode = String.format("%06d", random.nextInt(1000000));

        String redisKey = "email_verification:" + request.email();
        redisTemplate.opsForValue().set(redisKey, verificationCode);
        redisTemplate.expire(redisKey, 3, TimeUnit.MINUTES);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("bsh793262@gmail.com", "허니킵");
            helper.setTo(request.email());
            helper.setSubject("허니킵 이메일 인증번호");

            String emailContent = "<div style='margin:20px;'>"
                    + "<h1>이메일 인증번호</h1>"
                    + "<p>안녕하세요, 허니킵을 이용해 주셔서 감사합니다.</p>"
                    + "<p>인증번호는 <strong>" + verificationCode + "</strong> 입니다.</p>"
                    + "<p>해당 인증번호는 3분간 유효합니다.</p>"
                    + "</div>";

            helper.setText(emailContent, true);
            mailSender.send(message);

            loggingService.logAuth(
                    null,
                    getClientIp(),
                    getUserAgent(),
                    "인증코드_발송",
                    String.format("이메일 인증 코드 발송: %s", request.email())
            );

            return EmailVerifyResponse.builder()
                    .email(request.email())
                    .build();
        } catch (Exception e) {
            // 인증코드 발송 실패 로깅
            loggingService.logError(
                    "AUTH_ERROR",
                    String.format("이메일 인증 코드 발송 실패: %s (%s)", request.email(), e.getMessage()),
                    e,
                    "인증코드_발송_실패"
            );
            throw new CustomException(AuthErrorCode.EMAIL_SEND_FAILED);
        }
    }

    /**
     * 이메일 인증 코드 검증
     */
    public boolean verifyEmail(EmailVerifyCodeRequest request) {
        String redisKey = "email_verification:" + request.email();
        String storedCode = redisTemplate.opsForValue().get(redisKey);

        if (storedCode == null) {
            // 인증 코드 만료 로깅
            loggingService.logAuth(
                    null,
                    getClientIp(),
                    getUserAgent(),
                    "인증코드_만료",
                    String.format("인증 코드 만료: %s", request.email())
            );
            throw new CustomException(AuthErrorCode.VERIFICATION_CODE_EXPIRED);
        }

        boolean isValid = storedCode.equals(request.code());

        if (!isValid) {
            // 인증 코드 불일치 로깅
            loggingService.logAuth(
                    null,
                    getClientIp(),
                    getUserAgent(),
                    "인증코드_불일치",
                    String.format("인증 코드 불일치: %s", request.email())
            );
            throw new CustomException(AuthErrorCode.INVALID_VERIFICATION_CODE);
        }

        // 인증 성공 로깅
        loggingService.logAuth(
                null,
                getClientIp(),
                getUserAgent(),
                "인증코드_확인_성공",
                String.format("이메일 인증 성공: %s", request.email())
        );

        redisTemplate.delete(redisKey);
        return true;
    }

    /**
     * 사용자 비밀번호 검증
     *
     * @param userId
     * @param password
     * @return
     */
    public boolean validatePassword(Long userId, String password) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        boolean isValid = passwordEncoder.matches(password, user.getPassword());

        // 비밀번호 검증 결과 로깅
        loggingService.logAuth(
                userId,
                getClientIp(),
                getUserAgent(),
                isValid ? "비밀번호_검증_성공" : "비밀번호_검증_실패",
                String.format("비밀번호 검증 %s: %s", isValid ? "성공" : "실패", user.getEmail())
        );

        return isValid;
    }

    /**
     * 사용자 검증
     *
     * @param name
     * @param identityNumber
     * @param phoneNumber
     * @param email
     * @return
     */
    public boolean validateUser(String name, String identityNumber, String phoneNumber, String email) {
        // 1. 먼저 이메일로 사용자 검색
        Optional<User> emailUserOptional = userRepository.findByEmail(email);

        if (emailUserOptional.isPresent()) {
            User emailUser = emailUserOptional.get();
            String decryptedIdNumber = encryptionService.decrypt(emailUser.getIdentityNumber());

            // 이메일은 있지만 다른 정보가 일치하지 않는 경우
            if (!emailUser.getName().equals(name) ||
                    !decryptedIdNumber.equals(identityNumber) ||
                    !emailUser.getPhoneNumber().equals(phoneNumber)) {

                loggingService.logAuth(
                        emailUser.getId(),
                        getClientIp(),
                        getUserAgent(),
                        "이메일_이미_사용중",
                        String.format("이미 사용 중인 이메일: %s (정보 불일치)", email)
                );
                throw new CustomException(AuthErrorCode.EMAIL_ALREADY_IN_USE);
            }

            // 모든 정보 일치 - 기존 사용자 확인됨
            return true;
        }

        // 2. 이메일은 없지만 이름/주민번호/전화번호 조합으로 사용자 검색
        String encryptedIdNumber = encryptionService.encrypt(identityNumber);
        Optional<User> userInfoOptional = userRepository.findByNameAndIdentityNumberAndPhoneNumber(
                name, encryptedIdNumber, phoneNumber);

        if (userInfoOptional.isPresent()) {
            // 동일한 개인정보를 가진 사용자가 있지만 이메일이 다른 경우
            loggingService.logAuth(
                    userInfoOptional.get().getId(),
                    getClientIp(),
                    getUserAgent(),
                    "개인정보_이미_등록됨",
                    String.format("이미 등록된 사용자 정보 (다른 이메일): %s", name)
            );
            throw new CustomException(AuthErrorCode.USER_INFO_ALREADY_REGISTERED);
        }

        // 3. 신규 사용자 - 회원가입 진행 가능
        return false;
    }

    public TokenResponse reissueToken(String refreshToken) {
        // 리프레시 토큰 존재 확인
        if (refreshToken == null) {
            throw new CustomException(AuthErrorCode.MISSING_REFRESH_TOKEN);
        }

        Long userId;
        try {
            // 리프레시 토큰 검증 및 사용자 ID 추출
            userId = jwtTokenProvider.getUserId(refreshToken);
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            // JWT 형식이 올바르지 않은 경우 (예: 구조가 header.payload.signature가 아닌 경우)
            throw new CustomException(AuthErrorCode.INVALID_TOKEN);
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            // 토큰이 만료된 경우
            throw new CustomException(AuthErrorCode.REFRESH_TOKEN_EXPIRED);
        } catch (io.jsonwebtoken.security.SecurityException | io.jsonwebtoken.UnsupportedJwtException e) {
            // 서명이 유효하지 않거나 지원되지 않는 JWT인 경우
            throw new CustomException(AuthErrorCode.INVALID_TOKEN);
        } catch (Exception e) {
            // 기타 예외 처리
            throw new CustomException(AuthErrorCode.INVALID_TOKEN);
        }

        String refreshTokenKey = "refresh_token:" + userId;

        // 레디스에 저장된 리프레시 토큰 확인
        String storedToken = redisTemplate.opsForValue().get(refreshTokenKey);
        if (storedToken == null || !storedToken.equals(refreshToken)) {
            throw new CustomException(AuthErrorCode.REFRESH_TOKEN_EXPIRED);
        }

        // 새 토큰 발급
        TokenResponse newTokens = new TokenResponse(
                jwtTokenProvider.generateAccessToken(userId),
                jwtTokenProvider.generateRefreshToken(userId),
                jwtTokenProvider.getRefreshTokenExpiresIn()
        );


        // 레디스에 새 리프레시 토큰 저장
        redisTemplate.opsForValue().set(
                refreshTokenKey,
                newTokens.refreshToken(),
                newTokens.refreshTokenExpiresIn(),
                TimeUnit.MILLISECONDS
        );

        return newTokens;
    }

    /**
     * 현재 요청의 클라이언트 IP 주소를 가져옴
     */
    private String getClientIp() {
        try {
            HttpServletRequest request =
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            return extractClientIp(request);
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * 현재 요청의 User-Agent를 가져옴
     */
    private String getUserAgent() {
        try {
            HttpServletRequest request =
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            return request.getHeader("User-Agent");
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * 클라이언트의 실제 IP 주소 추출
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
}
