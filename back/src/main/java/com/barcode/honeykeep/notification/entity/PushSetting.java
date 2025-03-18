package com.barcode.honeykeep.notification.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.notification.type.PushType;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "push_settings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PushSetting extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "push_type_id")
    private PushType pushType;

    private Boolean agreed = false;

    @Builder
    protected PushSetting(User user, PushType pushType, Boolean agreed) {
        this.user = user;
        this.pushType = pushType;
        this.agreed = agreed;
    }
}