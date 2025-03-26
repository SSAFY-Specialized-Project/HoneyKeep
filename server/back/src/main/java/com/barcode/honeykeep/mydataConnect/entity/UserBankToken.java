package com.barcode.honeykeep.mydataConnect.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserBankToken {

    @Id
    @GeneratedValue
    private Long id;

    private Long userId;
    private String bankCode;
    private String accessToken;
    private LocalDateTime expiresAt;

    @Builder
    public UserBankToken(Long userId, String bankCode, String accessToken, LocalDateTime expiresAt) {
        this.userId = userId;
        this.bankCode = bankCode;
        this.accessToken = accessToken;
        this.expiresAt = expiresAt;
    }
}
