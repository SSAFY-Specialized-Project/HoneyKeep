package com.barcode.honeykeep.common.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    // API 카테고리 정의
    @Getter
    public enum ApiCategory {
        NORMAL_QUERY(100, Duration.ofMinutes(1)),
        FINANCIAL_TRANSACTION(100, Duration.ofMinutes(1)),
        AUTHENTICATION(100, Duration.ofSeconds(10)),
        PAYMENT(100, Duration.ofMinutes(1));

        private final int limit;
        private final Duration duration;

        ApiCategory(int limit, Duration duration) {
            this.limit = limit;
            this.duration = duration;
        }

    }

    private final LettuceBasedProxyManager proxyManager;

    @Autowired
    public RateLimitService(
            @Value("${spring.data.redis.host}") String redisHost,
            @Value("${spring.data.redis.port}") int redisPort,
            @Value("${spring.data.redis.password}") String redisPassword) {

        RedisURI redisUri = RedisURI.builder()
                .withHost(redisHost)
                .withPort(redisPort)
                .withPassword(redisPassword)
                .build();

        RedisClient redisClient = RedisClient.create(redisUri);

        // 프록시 매니저 생성
        this.proxyManager = LettuceBasedProxyManager.builderFor(redisClient)
                .withExpirationStrategy(ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofHours(1)))
                .build();
    }

    // URL 패턴에 따른 API 카테고리 결정
    public ApiCategory getCategoryFromUrl(String url) {
        if (url.startsWith("/api/v1/auth/")) {
            return ApiCategory.AUTHENTICATION;
        } else if (url.contains("/accounts/transfer") ||
                url.contains("/transactions/")) {
            return ApiCategory.FINANCIAL_TRANSACTION;
        } else if (url.startsWith("/api/v1/pay/")) {
            return ApiCategory.PAYMENT;
        } else {
            return ApiCategory.NORMAL_QUERY;
        }
    }

    // IP 주소에 대한 버킷 생성
    public Bucket resolveBucket(String key, ApiCategory category) {
        BucketConfiguration configuration = BucketConfiguration.builder()
                .addLimit(Bandwidth.simple(category.getLimit(), category.getDuration()))
                .build();

        // "rate-limit:" 접두사를 키에 추가하여 Redis 키 충돌 방지
        String redisKey = "rate-limit:" + key;

        // 새로운 API 사용
        return proxyManager.builder()
                .build(redisKey.getBytes(), configuration);
    }

    // 요청 처리 가능 여부 확인
    public boolean tryConsume(String key, ApiCategory category) {
        Bucket bucket = resolveBucket(key, category);
        return bucket.tryConsume(1);
    }

    // 남은 토큰 수 확인
    public long getAvailableTokens(String key, ApiCategory category) {
        Bucket bucket = resolveBucket(key, category);
        return bucket.getAvailableTokens();
    }
}