package com.barcode.honeykeep.auth.entity;

import com.barcode.honeykeep.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "certs")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Cert extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Builder
    protected Cert(User user) {
        this.user = user;
    }
}
