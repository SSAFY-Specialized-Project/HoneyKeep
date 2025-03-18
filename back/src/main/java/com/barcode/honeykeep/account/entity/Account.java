package com.barcode.honeykeep.account.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.transaction.entity.Transaction;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id")
    private Bank bank;

    private String accountNumber;

    @Embedded
    private Money money;

    @OneToMany(mappedBy = "account")
    List<Pocket> pockets = new ArrayList<>();

    @OneToMany(mappedBy = "account")
    List<Transaction> transactions = new ArrayList<>();

    @Builder
    protected Account(User user, Bank bank, String accountNumber, Money money) {
        this.user = user;
        this.bank = bank;
        this.accountNumber = accountNumber;
        this.money = money;
        this.pockets = new ArrayList<>();
        this.transactions = new ArrayList<>();
    }
}
