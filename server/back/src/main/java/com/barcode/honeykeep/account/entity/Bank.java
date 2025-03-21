package com.barcode.honeykeep.account.entity;

import com.barcode.honeykeep.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "banks")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    @OneToMany(mappedBy = "bank")
    private List<Account> accounts = new ArrayList<>();

    @Builder
    protected Bank(String code, String name) {
        this.code = code;
        this.name = name;
        this.accounts = new ArrayList<>();
    }
}
