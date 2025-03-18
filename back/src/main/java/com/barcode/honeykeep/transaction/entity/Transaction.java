package com.barcode.honeykeep.transaction.entity;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.entity.Pocket;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pocket_id")
    private Pocket pocket;

    private String name;

    private Money money;

    private LocalDateTime date;

    @Builder
    protected Transaction(Account account, Pocket pocket, String name, Money money, LocalDateTime date) {
        this.account = account;
        this.pocket = pocket;
        this.name = name;
        this.money = money;
        this.date = date;
    }
}
