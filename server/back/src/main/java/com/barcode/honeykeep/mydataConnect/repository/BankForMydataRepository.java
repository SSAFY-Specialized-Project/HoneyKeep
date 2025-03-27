package com.barcode.honeykeep.mydataConnect.repository;

import com.barcode.honeykeep.account.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankForMydataRepository extends JpaRepository<Bank, String> {
}
