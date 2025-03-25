package com.barcode.honeykeep.fixedexpense.repository;

import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {

    List<FixedExpense> findByUserId(Long userId);

}