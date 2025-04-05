package com.barcode.honeykeep.transaction.repository;

import com.barcode.honeykeep.fixedexpense.dto.TransactionSummaryDto;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.type.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByTypeAndDateAfter(TransactionType type, LocalDateTime startDate);

    // 특정 계좌의 모든 거래내역 조회 (최신순)
    List<Transaction> findByAccountIdOrderByDateDesc(Long accountId);

    @Query("SELECT new com.barcode.honeykeep.fixedexpense.dto.TransactionSummaryDto(t.id, t.name, t.amount.amount, t.date) " +
            "FROM Transaction t WHERE t.account.id = :accountId AND t.name = :name")
    List<TransactionSummaryDto> findTransactionSummariesByAccountAndName(Long accountId, String name);

    List<Transaction> findByAccount_User_IdAndTypeAndDateAfter(Long userId, TransactionType type, LocalDateTime date);

    // pocketID에 해당하는 포켓과 매핑된 거래내역 금액의 총합 조회
    @Query("SELECT COALESCE(SUM(t.amount.amount), 0) FROM Transaction t WHERE t.pocket.id = :pocketId")
    Long sumAmountByPocketId(@Param("pocketId") Long pocketId);

}