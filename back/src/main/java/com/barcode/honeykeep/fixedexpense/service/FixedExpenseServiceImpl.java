package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
import com.barcode.honeykeep.fixedexpense.repository.FixedExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        return expenses.stream()
                .map(toFixedExpensesResponse())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FixedExpenseResponse createFixedExpenses(Long userId, FixedExpenseRequest fixedExpenseRequest) {
        // 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException(HttpStatus.NOT_FOUND, "해당하는 유저를 찾을 수 없습니다"));

        FixedExpense fixedExpense = FixedExpense.builder()
                .user(user)
                .name(fixedExpenseRequest.getName())
                .money(fixedExpenseRequest.getMoney())
                .startDate(fixedExpenseRequest.getStartDate())
                .payDay(fixedExpenseRequest.getPayDay())
                .memo(fixedExpenseRequest.getMemo())
                .build();

        FixedExpense saved = fixedExpenseRepository.save(fixedExpense);

        return mapFixedExpensesResponse(saved);
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
                .id(fixedExpenses.getId())
                .name(fixedExpenses.getName())
                .money(fixedExpenses.getMoney())
                .startDate(fixedExpenses.getStartDate())
                .payDay(fixedExpenses.getPayDay())
                .memo(fixedExpenses.getMemo())
                .build();
    }
}
