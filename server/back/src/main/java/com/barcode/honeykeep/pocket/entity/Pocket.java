package com.barcode.honeykeep.pocket.entity;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.category.entity.Category;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.type.PocketType;
import com.barcode.honeykeep.transaction.entity.Transaction;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pockets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
public class Pocket extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String name;

    private String productName;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "total_amount"))
    private Money totalAmount;

    @Embedded
    @AttributeOverride(name = "amount", column = @Column(name = "saved_amount"))
    private Money savedAmount;

    private String link;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Boolean isFavorite = false;

    @Enumerated(EnumType.STRING)
    private PocketType type;

    private String imgUrl;

    private Boolean isActivated = false;

    @Column(name = "crawling_uuid", nullable = true)
    private String crawlingUuid;

    private Boolean isExceed = false;

    @OneToMany(mappedBy = "pocket")
    private List<Transaction> transactions = new ArrayList<>();

    @Builder
    protected Pocket(Account account, Category category, String name, String productName,
                     Money totalAmount, Money savedAmount, String link, LocalDateTime startDate,
                     LocalDateTime endDate, Boolean isFavorite, PocketType type, Boolean isActivated, String imgUrl,
                     String crawlingUuid) {
        this.account = account;
        this.category = category;
        this.name = name;
        this.productName = productName;
        this.totalAmount = totalAmount;
        this.savedAmount = savedAmount;
        this.link = link;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isFavorite = isFavorite;
        this.type = type;
        this.isActivated  = isActivated;
        this.imgUrl = imgUrl;
        this.transactions = new ArrayList<>();
        this.crawlingUuid = crawlingUuid;
    }



    public void setFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public void updateSavedAmount(Money newAmount) {
        this.savedAmount = newAmount;
    }

    public void updateIsExceed(Boolean isExceed) {
        this.isExceed = isExceed;
    }

    /**
     * 포켓 정보 일괄 업데이트
     */
    public void update(Account account, Category category, String name, String productName,
                       Money totalAmount, Money savedAmount, String link, LocalDateTime startDate,
                       LocalDateTime endDate, Boolean isFavorite, String imgUrl) {
        if (account != null) this.account = account;
        if (category != null) this.category = category;
        if (name != null) this.name = name;
        if (productName != null) this.productName = productName;
        if (totalAmount != null) this.totalAmount = totalAmount;
        if (savedAmount != null) this.savedAmount = savedAmount;
        if (link != null) this.link = link;
        if (startDate != null) this.startDate = startDate;
        if (endDate != null) this.endDate = endDate;
        if (isFavorite != null) this.isFavorite = isFavorite;
        if (imgUrl != null) this.imgUrl = imgUrl;
    }

    public void updateType(PocketType type) {
        this.type = type;
    }

    public void updateActivationStatus(Boolean isActivated) {
        this.isActivated = isActivated;
    }
}
