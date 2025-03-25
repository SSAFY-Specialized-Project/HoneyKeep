package com.barcode.honeykeep.pay.service;

import com.barcode.honeykeep.pay.cache.QrUuid;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.repository.PayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PayService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final int TTL_SECONDS = 60;
    private final PayRepository payRepository;

    public String createQr() {
        // UUID 생성
        String uuid = UUID.randomUUID().toString();

        // qruuid 생성
        QrUuid qrUuid = QrUuid.builder()
                .uuid(uuid)
                .createdAt(new Date())
                .isUsed(false)
                .build();

        // 생성된 UUID 값을 key로 Redis에 생성 시간 및 사용 여부 저장
        redisTemplate.opsForValue().set(uuid, qrUuid, TTL_SECONDS, TimeUnit.SECONDS);
        
        return uuid;
    }

    /**
     * 1. Redis에서 uuid로 유효성 검사
     * 2. 유효한 QR로 결제를 했으면 Repository에서 데이터 수정
     */
    public boolean pay(PayRequest payRequest) {


        return true;
    }
}
