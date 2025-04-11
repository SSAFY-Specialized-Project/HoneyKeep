package com.barcode.honeykeep.config;

import java.time.format.DateTimeFormatter;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.reactive.server.WebTestClient;

@TestConfiguration
public class TestConfig {
    public static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Bean
    public PasswordEncoder testPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RedisTemplate<String, Object> testRedisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();

        redisTemplate.setKeySerializer(stringSerializer);
        redisTemplate.setHashKeySerializer(stringSerializer);
        redisTemplate.setValueSerializer(jsonSerializer);
        redisTemplate.setHashValueSerializer(jsonSerializer);

        return redisTemplate;
    }

    /* WebTestClient 빈은 통합 테스트 시 불필요할 수 있음 (RestAssured 사용)
    @Bean
    public WebTestClient webTestClient() {
        // 기본 URL 설정 방식 변경 필요 (Testcontainers 등 고려)
        return WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:8080/api/v1") // 고정 포트 대신 동적 포트 사용 필요
                .build();
    }
    */
}