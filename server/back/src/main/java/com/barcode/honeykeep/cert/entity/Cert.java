package com.barcode.honeykeep.cert.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "certs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
public class Cert extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 인증서 데이터 - Base64 인코딩된 X.509 인증서
    @Column(name = "certificate_data", columnDefinition = "TEXT")
    private String certificateData;

    // 인증서에 포함된 공개키 - Base64 인코딩
    @Column(name = "public_key", columnDefinition = "TEXT", unique = true)
    private String publicKey;

    // 인증서 일련번호
    @Column(name = "serial_number", unique = true)
    private String serialNumber;

    // 인증서 발급일
    @Column(name = "issue_date")
    private LocalDateTime issueDate;

    // 인증서 만료일
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    // 인증서 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CertStatus status;

    // 인증서 발급자 (예: "HoneyKeep CA")
    @Column(name = "issuer")
    private String issuer;

    // 1원 인증 완료 여부
    @Column(name = "is_account_verified")
    private boolean isAccountVerified;

    // 마지막 사용 시간
    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Builder
    protected Cert(User user, String certificateData, String publicKey,
                   String serialNumber, LocalDateTime issueDate, LocalDateTime expiryDate,
                   CertStatus status, String issuer, boolean isAccountVerified) {
        this.user = user;
        this.certificateData = certificateData;
        this.publicKey = publicKey;
        this.serialNumber = serialNumber;
        this.issueDate = issueDate;
        this.expiryDate = expiryDate;
        this.status = status;
        this.issuer = issuer;
        this.isAccountVerified = isAccountVerified;
        this.lastUsedAt = null;  // 최초 생성 시에는 null
    }

    // 인증서 상태 열거형
    public enum CertStatus {
        ACTIVE,    // 활성
        REVOKED,   // 취소됨
        EXPIRED    // 만료됨
    }

    // 인증서 사용 기록 갱신
    public void updateLastUsed() {
        this.lastUsedAt = LocalDateTime.now();
    }

    // 인증서 상태 변경
    public void updateStatus(CertStatus status) {
        this.status = status;
    }

    // 인증서 취소
    public void revoke() {
        this.status = CertStatus.REVOKED;
    }

    // 인증서 만료
    public void expire() {
        this.status = CertStatus.EXPIRED;
    }

    // 1원 인증 완료 표시
    public void verifyAccount() {
        this.isAccountVerified = true;
    }
}
