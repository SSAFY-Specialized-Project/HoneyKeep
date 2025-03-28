package com.barcode.honeykeep.transaction.repository;

import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.type.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByTypeAndDateAfter(TransactionType type, LocalDateTime startDate);

    List<Transaction> findByAccount_IdAndName(Long accountId, String name);
}
