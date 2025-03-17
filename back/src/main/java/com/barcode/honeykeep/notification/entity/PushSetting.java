package com.barcode.honeykeep.notification.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "push_settings")
public class PushSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
}