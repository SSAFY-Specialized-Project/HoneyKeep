package com.barcode.honeykeep.account.repository;

import com.barcode.honeykeep.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepsository extends JpaRepository<Account, Long> {

    //계좌 목록 조회
    List<Account> findByUser_Id(Long userId);

    //계좌 번호로 계좌 단일 조회
    Optional<Account> findByAccountNumber(String accountNumber);

}


