package com.barcode.honeykeep.mydataConnect.repository;

import com.barcode.honeykeep.mydataConnect.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}
