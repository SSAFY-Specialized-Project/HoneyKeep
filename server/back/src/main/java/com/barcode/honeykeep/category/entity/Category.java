package com.barcode.honeykeep.category.entity;

import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.pocket.entity.Pocket;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Category extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "category")
    List<Pocket> pockets = new ArrayList<>();

    @Builder
    protected Category(String name) {
        this.name = name;
        this.pockets = new ArrayList<>();
    }
}
