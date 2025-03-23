package com.barcode.honeykeep.pay.service;

import com.barcode.honeykeep.pay.cache.QrUuid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PayService {

    private final RedisTemplate<String, String> redisTemplate;
    private final int TTL_SECONDS = 60;

    public String createQr() {
        // UUID 생성
        String uuid = UUID.randomUUID().toString();

        // qruuid 생성
        QrUuid qrUuid = QrUuid.builder()
                .uuid(uuid)
                .createdAt(Instant.now())
                .isUsed(false)
                .build();

        // 생성된 UUID 값을 key로 Redis에 생성 시간 및 사용 여부 저장
        redisTemplate.opsForValue().set(uuid, qrUuid, TTL_SECONDS, TimeUnit.SECONDS);
        
        return uuid;
    }
}
