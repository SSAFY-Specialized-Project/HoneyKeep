package com.barcode.honeykeep.common.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;

@EntityListeners(AuditingEntityListener.class)
@Getter
@MappedSuperclass
public abstract class BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt; 

    @LastModifiedDate
    private LocalDateTime updatedAt; 

    private LocalDateTime deletedAt; 

    private Boolean isDeleted = false;

    private String deletedReason;

    protected BaseEntity() {
    }

    public void delete(String reason) {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
        this.deletedReason = reason;
    }

    public void restore() {
        this.isDeleted = false;
        this.deletedAt = null;
        this.deletedReason = null;
    }

}
