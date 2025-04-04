package com.barcode.honeykeep.webauthn.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "webauthn_credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebAuthnCredential extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String credentialId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 64)
    private String name;

    @Column(nullable = false, length = 1024)
    private String publicKeyCose;

    @Column(nullable = false)
    private Long signatureCount;

    @Column(nullable = false)
    private String attestationType;

    @Column(nullable = false)
    private LocalDateTime registeredAt;

    @Column(length = 1024)
    private String aaguid;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CredentialStatus status;
    
    @Column(name = "transports", length = 255)
    private String transports;
    
    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;
    
    @Column(name = "device_type", length = 50)
    private String deviceType;
    
    @Column(name = "device_name", length = 255)
    private String deviceName;

    public enum CredentialStatus {
        ACTIVE,
        INACTIVE,
        REVOKED
    }
    
    public List<String> getTransportList() {
        if (transports == null || transports.isEmpty()) {
            return List.of();
        }
        return Arrays.asList(transports.split(","));
    }
    
    public void setTransportList(List<String> transportList) {
        if (transportList == null || transportList.isEmpty()) {
            this.transports = null;
        } else {
            this.transports = String.join(",", transportList);
        }
    }
    
    public void updateLastUsed() {
        this.lastUsedAt = LocalDateTime.now();
    }
    
    public void updateSignatureCount(long count) {
        if (count > this.signatureCount) {
            this.signatureCount = count;
        }
    }
    
    public void revoke() {
        this.status = CredentialStatus.REVOKED;
    }
    
    public void activate() {
        this.status = CredentialStatus.ACTIVE;
    }
    
    public void deactivate() {
        this.status = CredentialStatus.INACTIVE;
    }
} 