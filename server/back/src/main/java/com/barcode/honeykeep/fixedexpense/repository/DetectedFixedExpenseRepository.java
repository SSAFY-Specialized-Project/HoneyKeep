package com.barcode.honeykeep.fixedexpense.repository;

import com.barcode.honeykeep.fixedexpense.entity.DetectedFixedExpense;
import com.barcode.honeykeep.fixedexpense.type.DetectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetectedFixedExpenseRepository extends JpaRepository<DetectedFixedExpense, Long> {

    List<DetectedFixedExpense> findByUser_IdAndStatus(Long userId, DetectionStatus status);

    Optional<DetectedFixedExpense> findByUser_IdAndAccount_IdAndName(Long userId, Long accountId, String merchantName);

    List<DetectedFixedExpense> findByStatusIn(List<DetectionStatus> statuses);
}
