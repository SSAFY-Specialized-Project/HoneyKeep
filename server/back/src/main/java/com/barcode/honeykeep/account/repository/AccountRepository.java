package com.barcode.honeykeep.account.repository;

import com.barcode.honeykeep.account.entity.Account;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    //계좌 목록 조회
    List<Account> findByUser_Id(Long userId);

    //계좌 번호로 계좌 단일 조회
    Optional<Account> findByAccountNumber(String accountNumber);

    // 비관적 락을 이용해 계좌 번호로 계좌 엔티티 락
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from Account a where a.accountNumber = :accountNumber")
    Account findByAccountNumberWithLock(@Param("accountNumber") String accountNumber);

    Optional<Account> findByAccountNumberAndBank_Code(String s, String s1);
}


