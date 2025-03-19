package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
import com.barcode.honeykeep.fixedexpense.repository.FixedExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FixedExpenseServiceImpl implements FixedExpenseService {
    private final FixedExpenseRepository fixedExpenseRepository;

    @Override
    public List<FixedExpenseResponse> getFixedExpenses(Long userId) {
        List<FixedExpense> expenses = fixedExpenseRepository.findByUserId(userId);

        if (expenses.isEmpty()) {
            throw new CustomException(AuthErrorCode.USER_NOT_FOUND);
        }

        return expenses.stream()
                .map(toFixedExpensesResponse())
                .collect(Collectors.toList());
    }

    @Override
    public FixedExpenseResponse createFixedExpenses(FixedExpenseRequest fixedExpenseRequest) {
        return null;
    }

    @Override
    public FixedExpenseResponse updateFixedExpenses(Long id, FixedExpenseRequest fixedExpenseRequest) {
        return null;
    }

    @Override
    public void deleteFixedExpenses(Long id) {

    }

    @Override
    public boolean checkId(Long id) {
        return fixedExpenseRepository.existsById(id);
    }

    private Function<FixedExpense, FixedExpenseResponse> toFixedExpensesResponse() {
        return f -> mapFixedExpensesResponse(f);
    }

    private FixedExpenseResponse mapFixedExpensesResponse(FixedExpense fixedExpenses) {
        return FixedExpenseResponse.builder()
                .name(fixedExpenses.getName())
                .money(fixedExpenses.getMoney())
                .startDate(fixedExpenses.getStartDate())
                .payDay(fixedExpenses.getPayDay())
                .memo(fixedExpenses.getMemo())
                .build();
    }
}
