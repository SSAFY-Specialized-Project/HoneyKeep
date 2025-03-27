package com.barcode.honeykeep.category.entity;

import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.pocket.entity.Pocket;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SQLRestriction("is_deleted = false")
public class Category extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "category")
    List<Pocket> pockets = new ArrayList<>();

    @Builder
    protected Category(String name) {
        this.name = name;
        this.pockets = new ArrayList<>();
    }
    
    /**
     * 카테고리 이름 수정
     * @param name 새 카테고리 이름
     */
    public void updateName(String name) {
        this.name = name;
    }

    /**
     * 카테고리와 연관된 모든 포켓을 논리적으로 삭제
     * @param reason 삭제 이유
     */
    @Override
    public void delete(String reason) {
        super.delete(reason);
        if (this.pockets != null) {
            for (Pocket pocket : this.pockets) {
                if (!pocket.getIsDeleted()) {
                    pocket.delete(reason);
                }
            }
        }
    }
}