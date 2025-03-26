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
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
public class Account extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_code", referencedColumnName = "code")
    private Bank bank;

    private String accountName;

    private String accountNumber;

    private LocalDate accountExpiryDate;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "account_balance"))
    private Money accountBalance;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "daily_transfer_limit"))
    private Money dailyTransferLimit;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "one_time_transfer_limit"))
    private Money oneTimeTransferLimit;

    private LocalDate lastTransactionDate;

    @OneToMany(mappedBy = "account")
    List<Pocket> pockets = new ArrayList<>();

    @OneToMany(mappedBy = "account")
    List<Transaction> transactions = new ArrayList<>();

    @Builder
    protected Account(User user, Bank bank, String accountName, String accountNumber, LocalDate accountExpiryDate, Money accountBalance, Money dailyTransferLimit, Money oneTimeTransferLimit, LocalDate lastTransactionDate) {
        this.user = user;
        this.bank = bank;
        this.accountName = accountName;
        this.accountNumber = accountNumber;
        this.accountExpiryDate = accountExpiryDate;
        this.accountBalance = accountBalance;
        this.dailyTransferLimit = dailyTransferLimit;
        this.oneTimeTransferLimit = oneTimeTransferLimit;
        this.lastTransactionDate = lastTransactionDate;
        this.pockets = new ArrayList<>();
        this.transactions = new ArrayList<>();
    }
}
