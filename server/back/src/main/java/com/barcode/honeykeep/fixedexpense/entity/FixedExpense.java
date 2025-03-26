package com.barcode.honeykeep.fixedexpense.entity;

import com.barcode.honeykeep.account.entity.Account;
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

    //TODO: FixedExpense 관련해서, DTO들 다 수정해야할듯 하다. 프론트에 출금 계좌 정보까지 넘겨주는게 적절.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    private String name;

    @Embedded
    private Money money;

    private LocalDate startDate;

    private LocalDate payDay;

    private String memo;

    @Builder
    protected FixedExpense(User user, Account account, String name, Money money, LocalDate startDate, LocalDate payDay, String memo) {
        this.user = user;
        this.account = account;
        this.name = name;
        this.money = money;
        this.startDate = startDate;
        this.payDay = payDay;
        this.memo = memo;
    }

    public void update(Account account, String name, Money money, LocalDate startDate, LocalDate payDay, String memo) {
        if (account != null) this.account = account;
        if (name != null) this.name = name;
        if (money != null) this.money = money;
        if (startDate != null) this.startDate = startDate;
        if (payDay != null) this.payDay = payDay;
        if (memo != null) this.memo = memo;
    }


}
