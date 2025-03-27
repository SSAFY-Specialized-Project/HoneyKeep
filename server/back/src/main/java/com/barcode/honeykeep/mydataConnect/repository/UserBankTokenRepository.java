package com.barcode.honeykeep.mydataConnect.repository;

import com.barcode.honeykeep.mydataConnect.entity.UserBankToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserBankTokenRepository extends JpaRepository<UserBankToken, Long> {
    Optional<UserBankToken> findByUserIdAndBankCode(Long userId, String bankCode);

    Optional<UserBankToken> findByUserIdAndAccessToken(Long userId, String accessToken);
}
