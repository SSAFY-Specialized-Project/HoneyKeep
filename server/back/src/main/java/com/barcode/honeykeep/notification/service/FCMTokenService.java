package com.barcode.honeykeep.notification.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.notification.entity.FCMToken;
import com.barcode.honeykeep.notification.repository.FCMTokenRepository;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMTokenService {


    private final FCMTokenRepository fcmTokenRepository;
    private final UserRepository userRepository;



    //클라이언트한테 받은 FCM 토큰 저장
    public FCMToken saveFCMToken(Long userId, String token) {

        Optional<FCMToken> optionalToken  = fcmTokenRepository.findByToken(token);

        //만약 이미 토큰이 존재할 때
        if(optionalToken.isPresent()) {
            log.debug("이미 존재하는 FCM 토큰입니다. token: {}", token);
            return optionalToken.get();
        }
        //토큰 존재 안 할때
        else{
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

            FCMToken newToken = FCMToken.builder()
                    .token(token)
                    .user(user)
                    .build();
            FCMToken savedToken = fcmTokenRepository.save(newToken);
            log.info("새로운 FCM 토큰 저장 성공 - userId: {}, token: {}", userId, token);
            return savedToken;
        }

    }
}
