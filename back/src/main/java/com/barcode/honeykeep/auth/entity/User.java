package com.barcode.honeykeep.auth.entity;

import java.util.ArrayList;
import java.util.List;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.common.entity.BaseEntity;
import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
import com.barcode.honeykeep.notification.entity.Notification;

import com.barcode.honeykeep.notification.entity.PushSetting;
import jakarta.persistence.*;
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
    private List<FixedExpense> fixedExpense = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<PushSetting> pushSettings = new ArrayList<>();

    @OneToOne(mappedBy = "user")
    private Cert cert;

    @Builder
    protected User(String userKey, String email, String username, String institutionCode,
                String identityNumber, String password, String phoneNumber, Cert cert) {
        this.userKey = userKey;
        this.email = email;
        this.username = username;
        this.institutionCode = institutionCode == null ? "00100" : institutionCode;
        this.identityNumber = identityNumber;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.notifications = new ArrayList<>();
        this.accounts = new ArrayList<>();
        this.fixedExpense = new ArrayList<>();
        this.pushSettings = new ArrayList<>();
        this.cert = cert;
    }

}
