package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;

import java.util.List;

public interface FixedExpenseService {
    List<FixedExpenseResponse> getAllFixedExpenses(Integer userId);

    FixedExpenseResponse getFixedExpenses(Integer userId, Long id);

    FixedExpenseResponse createFixedExpenses(Integer userId, FixedExpenseRequest fixedExpenseRequest);

    FixedExpenseResponse updateFixedExpenses(Integer value, Long id, FixedExpenseRequest fixedExpenseRequest);

    void deleteFixedExpenses(Integer userId, Long id);
}
