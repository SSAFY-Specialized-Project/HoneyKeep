package com.barcode.honeykeep.fixedexpense.entity;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.fixedexpense.type.DetectionStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "detected_fixed_expenses")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
public class DetectedFixedExpense extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    private String name;

    private String originName;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "average_amount"))
    private Money averageAmount;

    private Integer averageDay;

    @Enumerated(EnumType.STRING)
    private DetectionStatus status;

    private LocalDate lastTransactionDate;

    private Integer transactionCount;

    private Double detectionScore;
    private Double merchantScore;
    private Double amountScore;
    private Double dateScore;
    private Double persistenceScore;

    @Builder
    protected DetectedFixedExpense(User user, Account account, String name, String originName, Money averageAmount, Integer averageDay, DetectionStatus status, LocalDate lastTransactionDate, Integer transactionCount, Double detectionScore, Double merchantScore, Double amountScore, Double dateScore, Double persistenceScore) {
        this.user = user;
        this.account = account;
        this.name = name;
        this.originName = originName;
        this.averageAmount = averageAmount;
        this.averageDay = averageDay;
        this.status = status;
        this.lastTransactionDate = lastTransactionDate;
        this.transactionCount = transactionCount;
        this.detectionScore = detectionScore;
        this.merchantScore = merchantScore;
        this.amountScore = amountScore;
        this.dateScore = dateScore;
        this.persistenceScore = persistenceScore;
    }

    public void update(Account account, String name, String averageAmount, Integer averageDay) {
        if (this.originName == null && !this.name.equals(name)) {
            this.originName = this.name;
        }

        if (account != null) this.account = account;
        if (name != null) this.name = name;
        if (averageAmount != null) this.averageAmount = new Money(new BigDecimal(averageAmount));
        if (averageDay != null) this.averageDay = averageDay;
    }
}
