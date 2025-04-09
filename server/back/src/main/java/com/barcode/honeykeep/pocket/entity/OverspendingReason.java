package com.barcode.honeykeep.pocket.entity;

import com.barcode.honeykeep.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "overspending_reasons")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OverspendingReason extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 어떤 포켓에 대한 이유인지
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pocket_id", nullable = false)
    private Pocket pocket;

    // 초과 사용 이유 (자유 텍스트 or 선택형)
    @Column(nullable = false, length = 255)
    private String reasonText;

    @Builder
    public OverspendingReason(Pocket pocket, String reasonText) {
        this.pocket = pocket;
        this.reasonText = reasonText;
    }
}
