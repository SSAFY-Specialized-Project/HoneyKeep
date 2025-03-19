package com.barcode.honeykeep.fixedexpense.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.common.vo.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_expense")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedExpense extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    @Embedded
    private Money money;

    private LocalDateTime startDate;

    private LocalDateTime payDay;

    private String memo;

    @Builder
    protected FixedExpense(User user, String name, Money money, LocalDateTime startDate, LocalDateTime payDay, String memo) {
        this.user = user;
        this.name = name;
        this.money = money;
        this.startDate = startDate;
        this.payDay = payDay;
        this.memo = memo;
    }
}
