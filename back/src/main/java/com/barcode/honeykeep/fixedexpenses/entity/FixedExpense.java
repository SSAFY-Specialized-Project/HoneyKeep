package com.barcode.honeykeep.fixedexpenses.entity;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.vo.Money;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "fixed_exceptions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FixedExpense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    private String name;
    @Embedded
    private Money amount;
    private LocalDateTime startDate;
    private LocalDateTime payDay;
    private String memo;
}
