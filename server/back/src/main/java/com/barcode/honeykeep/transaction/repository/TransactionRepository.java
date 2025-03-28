package com.barcode.honeykeep.transaction.repository;

import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.type.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount_User_IdAndTypeAndDateAfter(Long userId, TransactionType type, LocalDateTime startDate);

    // 특정 계좌의 모든 거래내역 조회 (최신순)
    List<Transaction> findByAccountIdOrderByDateDesc(Long accountId);

}