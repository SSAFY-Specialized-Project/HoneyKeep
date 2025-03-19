package com.barcode.honeykeep.auth.service;

import com.barcode.honeykeep.auth.dto.*;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import com.barcode.honeykeep.common.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final WebClient webClient = WebClient.create("https://finopenapi.ssafy.io/ssafy/api/v1");
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;

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

        // Redis에 refresh token 저장
        String refreshTokenKey = "refresh_token:" + user.getId();
        redisTemplate.opsForValue().set(refreshTokenKey, refreshToken);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
