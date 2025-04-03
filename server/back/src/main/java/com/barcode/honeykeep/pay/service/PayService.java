package com.barcode.honeykeep.pay.service;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.cache.QrUuid;
import com.barcode.honeykeep.pay.dto.OnlinePayRequest;
import com.barcode.honeykeep.pay.dto.PayDto;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.exception.PayErrorCode;
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
        log.info("QR 코드 생성 요청");
        String uuid = UUID.randomUUID().toString();

        QrUuid qrUuid = QrUuid.builder()
                .uuid(uuid)
                .createdAt(new Date())
                .isUsed(false)
                .build();

        redisTemplate.opsForValue().set(uuid, qrUuid, TTL_SECONDS, TimeUnit.SECONDS);

        log.info("QR 코드 생성 완료, UUID: {}", uuid);
        return uuid;
    }

    /**
     * 1. Redis에서 uuid로 유효성 검사
     * 2. 유효한 QR로 결제를 했으면 Repository에서 데이터 수정
     */
    public boolean pay(UserId userId, PayRequest payRequest) {
        log.info("결제 요청 시작, userId: {}, QR UUID: {}", userId, payRequest.getUuid());

        PayDto payDto = PayDto.builder()
                .accountId(payRequest.getAccountId())
                .amount(payRequest.getAmount())
                .pocketId(payRequest.getPocketId())
                .productName(payRequest.getProductName())
                .build();

        // Redis에서 QR UUID 조회
        Object value = redisTemplate.opsForValue().get(payRequest.getUuid());

        if (value == null) {
            log.error("유효하지 않은 QR 코드 요청: {}", payRequest.getUuid());
            throw new CustomException(PayErrorCode.INVALID_QR);
        }

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            QrUuid qrUuid = objectMapper.convertValue(value, QrUuid.class);
            if (qrUuid.isUsed()) {
                log.error("이미 사용된 QR 코드: {}", payRequest.getUuid());
                throw new CustomException(PayErrorCode.ALREADY_USED_QR);
            }
            else {
                log.info("유효한 QR 코드 확인: {}", payRequest.getUuid());
                boolean result = payRepository.payment(userId, payDto);

                log.info("QR 결제 처리 결과: {}", result ? "성공" : "실패");
                return result;
            }
        } catch (IllegalArgumentException e) {
            log.error("QR 코드 변환 중 에러 발생: {}", e.getMessage());
            throw new CustomException(PayErrorCode.INVALID_QR);
        }
    }

    /**
     * 온라인 페이 처리
     */
    public boolean onlinePay(UserId userId, OnlinePayRequest onlinePayRequest) {
        PayDto payDto = PayDto.builder()
                .accountId(onlinePayRequest.getAccountId())
                .amount(onlinePayRequest.getAmount())
                .pocketId(onlinePayRequest.getPocketId())
                .productName(onlinePayRequest.getProductName())
                .build();

        boolean result = payRepository.payment(userId, payDto);
        log.info("온라인 결제 처리 결과: {}", result ? "성공" : "실패");
        return result;
    }
}
