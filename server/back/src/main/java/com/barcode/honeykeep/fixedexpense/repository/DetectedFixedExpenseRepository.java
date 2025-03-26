package com.barcode.honeykeep.fixedexpense.repository;

import com.barcode.honeykeep.fixedexpense.entity.DetectedFixedExpense;
import com.barcode.honeykeep.fixedexpense.type.DetectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetectedFixedExpenseRepository extends JpaRepository<DetectedFixedExpense, Long> {

    List<DetectedFixedExpense> findByUser_IdAndStatus(Long userId, DetectionStatus status);

}
