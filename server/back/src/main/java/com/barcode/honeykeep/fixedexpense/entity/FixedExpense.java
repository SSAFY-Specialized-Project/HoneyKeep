package com.barcode.honeykeep.fixedexpense.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.common.vo.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_expenses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
public class FixedExpense extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    @Embedded
    private Money money;

    private LocalDate startDate;

    private LocalDate payDay;

    private String memo;

    @Builder
    protected FixedExpense(User user, String name, Money money, LocalDate startDate, LocalDate payDay, String memo) {
        this.user = user;
        this.name = name;
        this.money = money;
        this.startDate = startDate;
        this.payDay = payDay;
        this.memo = memo;
    }

    public void update(String name, Money money, LocalDate startDate, LocalDate payDay, String memo) {
        if (name != null) this.name = name;
        if (money != null) this.money = money;
        if (startDate != null) this.startDate = startDate;
        if (payDay != null) this.payDay = payDay;
        if (memo != null) this.memo = memo;
    }


}
