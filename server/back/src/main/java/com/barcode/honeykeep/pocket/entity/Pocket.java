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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pockets")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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

    private PocketType type;

    @OneToMany(mappedBy = "pocket")
    private List<Transaction> transactions = new ArrayList<>();

    @Builder
    protected Pocket(Account account, Category category, String name, String productName, Money totalAmount, Money savedAmount, String link, LocalDateTime startDate, LocalDateTime endDate, Boolean isFavorite, PocketType type) {
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
        this.transactions = new ArrayList<>();
    }

    /**
     * 포켓 논리적 삭제
     * @param reason 삭제 이유
     */
    @Override
    public void delete(String reason) {
        // 부모 클래스(BaseEntity)의 delete 메소드 호출
        super.delete(reason);
    }

    // Pocket 엔티티에 추가
    public void changeType(PocketType newType) {
        this.type = newType;
    }

    public void setFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }

    public void updateSavedAmount(Money newAmount) {
        this.savedAmount = newAmount;
    }
}
