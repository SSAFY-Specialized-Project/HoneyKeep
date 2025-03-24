package com.barcode.honeykeep.auth.service;

import com.barcode.honeykeep.auth.dto.*;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.logging.LoggingService;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
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
     */
    public RegisterResponse registerUser(RegisterRequest request) {
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("apiKey", ssafyFinancialNetworkApiKey);
        requestBody.put("userId", request.email());

        User user = webClient.post()
                .uri("/member/")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(User.class)
                .block();

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

        newUser = authRepository.save(newUser);
        
        // 회원가입 이벤트 로깅
        loggingService.logAuthEvent(
            newUser.getId(), 
            "회원가입", 
            String.format("신규 사용자 등록: %s (%s)", newUser.getEmail(), newUser.getName())
        );

        return RegisterResponse.toDto(newUser);
    }

    /**
     * 사용자 로그인 처리
     */
    public TokenResponse authenticateUser(LoginRequest request) {
        User user = authRepository.findByEmail(request.email())
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

        String refreshTokenKey = "refresh_token:" + user.getId();
        redisTemplate.opsForValue().set(refreshTokenKey, refreshToken);
        
        // 로그인 성공 로깅
        loggingService.logAuth(
            user.getId(),
            getClientIp(),
            getUserAgent(),
            "로그인_성공",
            String.format("로그인 성공: %s (%s)", user.getEmail(), user.getName())
        );

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * 이메일 인증 코드 발송
     */
    public EmailVerifyResponse sendVerification(EmailVerifyRequest request) throws UnsupportedEncodingException {
        if (request.email() == null || request.email().isEmpty()) {
            throw new CustomException(AuthErrorCode.INVALID_EMAIL);
        }

        if (authRepository.findByEmail(request.email()).isPresent()) {
            loggingService.logAuth(
                null,
                getClientIp(),
                getUserAgent(),
                "이메일_중복",
                String.format("회원가입 시도: 이미 존재하는 이메일 (%s)", request.email())
            );
            throw new CustomException(AuthErrorCode.EMAIL_ALREADY_EXISTS);
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
     */
    public boolean validatePassword(Integer userId, String password) {
        User user = authRepository.findById(userId)
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
