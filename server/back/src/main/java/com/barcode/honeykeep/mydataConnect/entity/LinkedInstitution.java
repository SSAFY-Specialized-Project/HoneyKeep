package com.barcode.honeykeep.mydataConnect.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Entity
public class LinkedInstitution {

    @Id
    @GeneratedValue
    private Long id;

    private Long userId;
    private String bankCode;

    private LocalDateTime connectedAt;

    @Builder
    protected LinkedInstitution(Long userId, String bankCode, LocalDateTime connectedAt) {
        this.userId = userId;
        this.bankCode = bankCode;
        this.connectedAt = connectedAt;
    }
}
