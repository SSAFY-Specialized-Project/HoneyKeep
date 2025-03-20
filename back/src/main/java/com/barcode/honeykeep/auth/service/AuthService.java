package com.barcode.honeykeep.auth.service;

import com.barcode.honeykeep.auth.dto.*;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.UserId;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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

    @Value("${SSAFY_FINANCIAL_NETWORK_API_KEY}")
    private String ssafyFinancialNetworkApiKey;

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

        return RegisterResponse.toDto(newUser);
    }

    public TokenResponse authenticateUser(LoginRequest request) {
        User user = authRepository.findByEmail(request.email())
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new CustomException(AuthErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        String refreshTokenKey = "refresh_token:" + user.getId();
        redisTemplate.opsForValue().set(refreshTokenKey, refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

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

            return EmailVerifyResponse.builder()
                    .email(request.email())
                    .build();
        } catch (Exception e) {
            throw new CustomException(AuthErrorCode.EMAIL_SEND_FAILED);
        }
    }

    public boolean verifyEmail(EmailVerifyCodeRequest request) {
        String redisKey = "email_verification:" + request.email();
        String storedCode = redisTemplate.opsForValue().get(redisKey);

        if (storedCode == null) {
            throw new CustomException(AuthErrorCode.VERIFICATION_CODE_EXPIRED);
        }

        boolean isValid = storedCode.equals(request.code());

        if (isValid) {
            redisTemplate.delete(redisKey);
        }

        return isValid;
    }

    public boolean validatePassword(Integer userId, String password) {
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        return passwordEncoder.matches(password, user.getPassword());
    }
}
