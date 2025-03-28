package com.barcode.honeykeep.transaction.repository;

import com.barcode.honeykeep.fixedexpense.dto.TransactionSummaryDto;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.type.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByTypeAndDateAfter(TransactionType type, LocalDateTime startDate);

    @Query("SELECT new com.barcode.honeykeep.fixedexpense.dto.TransactionSummaryDto(t.id, t.name, t.amount.amount, t.date) " +
            "FROM Transaction t WHERE t.account.id = :accountId AND t.name = :name")
    List<TransactionSummaryDto> findTransactionSummariesByAccountAndName(Long accountId, String name);
}
