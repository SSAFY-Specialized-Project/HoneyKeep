package com.barcode.honeykeep.auth.entity;

import jakarta.persistence.*;

@Entity
@Table(name="certs")
public class Cert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

}
