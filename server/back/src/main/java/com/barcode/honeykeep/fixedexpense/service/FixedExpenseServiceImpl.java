package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.auth.repository.AuthRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseRequest;
import com.barcode.honeykeep.fixedexpense.dto.FixedExpenseResponse;
import com.barcode.honeykeep.fixedexpense.entity.FixedExpense;
import com.barcode.honeykeep.fixedexpense.exception.FixedExpenseErrorCode;
import com.barcode.honeykeep.fixedexpense.repository.FixedExpenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final AuthRepository authRepository;

    @Override
    public List<FixedExpenseResponse> getAllFixedExpenses(Integer userId) {
        List<FixedExpense> expenses = fixedExpenseRepository.findByUserId(userId);

        // 없을 경우 빈 리스트 반환
        return expenses.stream()
                .map(toFixedExpensesResponse())
                .collect(Collectors.toList());
    }

    @Override
    public FixedExpenseResponse getFixedExpenses(Integer userId, Long id) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!fixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        return mapFixedExpensesResponse(fixedExpense);
    }

    @Override
    @Transactional
    public FixedExpenseResponse createFixedExpenses(Integer userId, FixedExpenseRequest fixedExpenseRequest) {
        // 유저 조회
        User user = authRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        FixedExpense fixedExpense = FixedExpense.builder()
                .user(user)
                .name(fixedExpenseRequest.name())
                .money(fixedExpenseRequest.money())
                .startDate(fixedExpenseRequest.startDate())
                .payDay(fixedExpenseRequest.payDay())
                .memo(fixedExpenseRequest.memo())
                .build();

        FixedExpense saved = fixedExpenseRepository.save(fixedExpense);

        return mapFixedExpensesResponse(saved);
    }

    @Override
    public FixedExpenseResponse updateFixedExpenses(Integer userId, Long id, FixedExpenseRequest fixedExpenseRequest) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        // 2. 본인 고정지출인지 확인
        if (!fixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS); // 유저 권한 없음
        }

        // 3. 수정
        fixedExpense.update(
                fixedExpenseRequest.name(),
                fixedExpenseRequest.money(),
                fixedExpenseRequest.startDate(),
                fixedExpenseRequest.payDay(),
                fixedExpenseRequest.memo()
        );

        return mapFixedExpensesResponse(fixedExpense);
    }

    @Override
    public void deleteFixedExpenses(Integer userId, Long id) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!fixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS); // 유저 권한 없음
        }

        fixedExpenseRepository.delete(fixedExpense);
    }

    private Function<FixedExpense, FixedExpenseResponse> toFixedExpensesResponse() {
        return f -> mapFixedExpensesResponse(f);
    }

    private FixedExpenseResponse mapFixedExpensesResponse(FixedExpense fixedExpense) {
        return FixedExpenseResponse.builder()
                .id(fixedExpense.getId())
                .name(fixedExpense.getName())
                .money(fixedExpense.getMoney())
                .startDate(fixedExpense.getStartDate())
                .payDay(fixedExpense.getPayDay())
                .memo(fixedExpense.getMemo())
                .build();
    }
}
