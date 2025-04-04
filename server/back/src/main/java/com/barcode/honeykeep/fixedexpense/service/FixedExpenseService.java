package com.barcode.honeykeep.fixedexpense.service;

import com.barcode.honeykeep.account.dto.AccountSummaryDto;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
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

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FixedExpenseService {
    private final FixedExpenseRepository fixedExpenseRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;

    public List<FixedExpenseResponse> getAllFixedExpenses(Long userId) {
        List<FixedExpense> expenses = fixedExpenseRepository.findByUser_Id(userId);

        return expenses.stream()
                .map(this::mapFixedExpensesResponse)
                .toList();
    }

    public FixedExpenseResponse getFixedExpenses(Long userId, Long id) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!fixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        return mapFixedExpensesResponse(fixedExpense);
    }

    @Transactional
    public FixedExpenseResponse createFixedExpenses(Long userId, FixedExpenseRequest fixedExpenseRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(AuthErrorCode.USER_NOT_FOUND));

        Account account = accountRepository.findByAccountNumber(fixedExpenseRequest.accountNumber())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        FixedExpense fixedExpense = FixedExpense.builder()
                .account(account)
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

    @Transactional
    public FixedExpenseResponse updateFixedExpenses(Long userId, Long id, FixedExpenseRequest fixedExpenseRequest) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!fixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        Account account = accountRepository.findByAccountNumber(fixedExpenseRequest.accountNumber())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        fixedExpense.update(
                account,
                fixedExpenseRequest.name(),
                fixedExpenseRequest.money(),
                fixedExpenseRequest.startDate(),
                fixedExpenseRequest.payDay(),
                fixedExpenseRequest.memo()
        );

        return mapFixedExpensesResponse(fixedExpense);
    }

    @Transactional
    public void deleteFixedExpenses(Long userId, Long id) {
        FixedExpense fixedExpense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new CustomException(FixedExpenseErrorCode.FIXED_EXPENSE_NOT_FOUND));

        if (!fixedExpense.getUser().getId().equals(userId)) {
            throw new CustomException(AuthErrorCode.FORBIDDEN_ACCESS);
        }

        /**
         * is_deleted = true로 변경
         * 이후 더티 체킹 -> 업데이트 됨.
         */
        fixedExpense.delete("");
    }

    protected FixedExpenseResponse mapFixedExpensesResponse(FixedExpense fixedExpense) {
        return new FixedExpenseResponse(
                fixedExpense.getId(),
                new AccountSummaryDto(
                        fixedExpense.getAccount().getBank().getName(),
                        fixedExpense.getAccount().getAccountName(),
                        fixedExpense.getAccount().getAccountNumber()
                ),
                fixedExpense.getName(),
                fixedExpense.getMoney(),
                fixedExpense.getStartDate(),
                fixedExpense.getPayDay(),
                fixedExpense.getMemo()
        );
    }
}
