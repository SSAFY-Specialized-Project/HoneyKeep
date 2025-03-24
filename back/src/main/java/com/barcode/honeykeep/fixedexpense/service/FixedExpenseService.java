package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;

import java.util.List;

public interface FixedExpenseService {
    List<FixedExpenseResponse> getFixedExpenses(Long userId);

    FixedExpenseResponse createFixedExpenses(Long userId, FixedExpenseRequest fixedExpenseRequest);

    FixedExpenseResponse updateFixedExpenses(Long id, FixedExpenseRequest fixedExpenseRequest);

    void deleteFixedExpenses(Long id);

    boolean checkId(Long id);
}
