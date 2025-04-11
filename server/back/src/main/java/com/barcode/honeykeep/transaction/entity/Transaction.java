package com.barcode.honeykeep.transaction.entity;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.transaction.type.TransactionType;
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

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "amount"))
    private Money amount;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "balance"))
    private Money balance;

    private LocalDateTime date;

    @Enumerated(EnumType.STRING)
    private TransactionType type;

    private String memo;

    @Builder
    protected Transaction(Account account, Pocket pocket, String name, Money amount, Money balance, LocalDateTime date, TransactionType type, String memo) {
        this.account = account;
        this.pocket = pocket;
        this.name = name;
        this.amount = amount;
        this.balance = balance;
        this.date = date;
        this.type = type;
        this.memo = memo;
    }

    public void updateMemo(String memo) {
        this.memo = memo;
    }

    /**
     * 거래내역에 포켓 연결
     */
    public void updatePocket(Pocket pocket) {
        this.pocket = pocket;
    }
}
