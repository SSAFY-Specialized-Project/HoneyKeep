package com.barcode.honeykeep.transaction.repository;

import com.barcode.honeykeep.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByAccount_User_IdAndDateAfter(Long userId, LocalDateTime startDate);

}
