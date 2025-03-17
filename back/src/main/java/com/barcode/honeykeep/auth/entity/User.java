package com.barcode.honeykeep.auth.entity;

import java.util.ArrayList;
import java.util.List;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.fixedexpenses.entity.FixedExpense;
import com.barcode.honeykeep.notification.entity.Notification;

import com.barcode.honeykeep.notification.entity.PushSetting;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String userKey;
    private String email;
    private String username;
    private String institutionCode = "00100";
    private String identityNumber;
    private String password;
    private String phoneNumber;
    @OneToMany(mappedBy = "user")
    private List<Notification> notifications = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<Account> accounts = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<FixedExpense> fixedExpenses = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<PushSetting> pushSettings = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<Cert> certs = new ArrayList<>();

    @Builder
    public User(String userKey, String email, String username, String institutionCode,
                String identityNumber, String password, String phoneNumber) {
        this.userKey = userKey;
        this.email = email;
        this.username = username;
        this.institutionCode = institutionCode == null ? "00100" : institutionCode;
        this.identityNumber = identityNumber;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.notifications = new ArrayList<>();
        this.accounts = new ArrayList<>();
        this.fixedExpenses = new ArrayList<>();
        this.pushSettings = new ArrayList<>();
        this.certs = new ArrayList<>();
    }

}
