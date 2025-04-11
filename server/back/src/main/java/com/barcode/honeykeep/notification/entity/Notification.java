package com.barcode.honeykeep.notification.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.notification.type.PushType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "notifications")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
@Builder
@AllArgsConstructor
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 알림 유형 (예: REMINDER, TRANSFER, PAYMENT 등)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PushType type;

    // 알림 제목
    private String title;

    // 알림 본문
    @Column(nullable = false)
    private String body;

    private Boolean isRead = false;

    public void markAsRead() {
        if (!this.isRead) {
            this.isRead = true;
        }
    }
}
