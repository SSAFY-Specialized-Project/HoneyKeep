package com.barcode.honeykeep.mydataConnect.repository;

import com.barcode.honeykeep.mydataConnect.entity.Bank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<Bank, String> {
}
