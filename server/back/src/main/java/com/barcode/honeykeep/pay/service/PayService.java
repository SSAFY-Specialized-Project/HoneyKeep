package com.barcode.honeykeep.pay.service;

import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.cache.QrUuid;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.repository.PayRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class PayService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final int TTL_SECONDS = 600;
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
    public boolean pay(UserId userId, PayRequest payRequest) {
        // Redis에서 uuid에 저장된 값 가져오기
        Object value = redisTemplate.opsForValue().get(payRequest.getUuid());

        // TTL이 만료되거나 애초에 저장하지 않았던 UUID라면 return false
        if(value == null) {
            return false;
        }

        // 값이 존재하면 JSON 배열로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Object → QrUuid 변환
            QrUuid qrUuid = objectMapper.convertValue(value, QrUuid.class);

            // isUsed 값 확인
            boolean isUsed = qrUuid.isUsed();

            // 이미 사용된 QR이면 실패
            if (isUsed) {
                return false;
            } 
            // 사용하지 않은 QR이면 결제 정상 처리
            else {
                return payRepository.payment(userId, payRequest);
            }

        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
