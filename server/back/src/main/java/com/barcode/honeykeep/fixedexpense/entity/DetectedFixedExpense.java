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

    private Double avgInterval;
    private LocalDate lastTransactionDate;

    private Integer transactionCount;

    private Double detectionScore;
    private Double amountScore;
    private Double dateScore;
    private Double persistenceScore;
    private Double periodicityScore;

    private Double weekendRatio;
    private Double intervalStd;
    private Double intervalCv;
    private Double continuityRatio;
    private Double amountTrendSlope;
    private Double amountTrendR2;

    @Builder
    protected DetectedFixedExpense(User user, Account account, String name, String originName, Money averageAmount, Integer averageDay, DetectionStatus status, Double avgInterval, LocalDate lastTransactionDate, Integer transactionCount, Double detectionScore, Double amountScore, Double dateScore, Double persistenceScore, Double periodicityScore, Double weekendRatio, Double intervalStd, Double intervalCv, Double continuityRatio, Double amountTrendSlope, Double amountTrendR2) {
        this.user = user;
        this.account = account;
        this.name = name;
        this.originName = originName;
        this.averageAmount = averageAmount;
        this.averageDay = averageDay;
        this.status = status;
        this.avgInterval = avgInterval;
        this.lastTransactionDate = lastTransactionDate;
        this.transactionCount = transactionCount;
        this.detectionScore = detectionScore;
        this.amountScore = amountScore;
        this.dateScore = dateScore;
        this.persistenceScore = persistenceScore;
        this.periodicityScore = periodicityScore;
        this.weekendRatio = weekendRatio;
        this.intervalStd = intervalStd;
        this.intervalCv = intervalCv;
        this.continuityRatio = continuityRatio;
        this.amountTrendSlope = amountTrendSlope;
        this.amountTrendR2 = amountTrendR2;
    }

    public void update(Account account, String name, String originName, String averageAmount, Integer averageDay) {
        if (originName != null && !name.equals(originName)) this.originName = originName;
        if (account != null) this.account = account;
        if (name != null) this.name = name;
        if (averageAmount != null) this.averageAmount = new Money(new BigDecimal(averageAmount));
        if (averageDay != null) this.averageDay = averageDay;
    }

    public void updateDetectionAttributes(Double avgInterval,
                                          LocalDate lastTransactionDate,
                                          Integer transactionCount,
                                          Double detectionScore,
                                          Double amountScore,
                                          Double dateScore,
                                          Double persistenceScore,
                                          Double periodicityScore,
                                          Double weekendRatio,
                                          Double intervalStd,
                                          Double intervalCv,
                                          Double continuityRatio,
                                          Double amountTrendSlope,
                                          Double amountTrendR2) {
        this.avgInterval = avgInterval;
        this.lastTransactionDate = lastTransactionDate;
        this.transactionCount = transactionCount;
        this.detectionScore = detectionScore;
        this.amountScore = amountScore;
        this.dateScore = dateScore;
        this.persistenceScore = persistenceScore;
        this.periodicityScore = periodicityScore;
        this.weekendRatio = weekendRatio;
        this.intervalStd = intervalStd;
        this.intervalCv = intervalCv;
        this.continuityRatio = continuityRatio;
        this.amountTrendSlope = amountTrendSlope;
        this.amountTrendR2 = amountTrendR2;
    }

    public void approve() {
        this.status = DetectionStatus.APPROVED;
    }

    public void reject() {
        this.status = DetectionStatus.REJECTED;
    }
}
