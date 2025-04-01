package com.barcode.honeykeep.account.service;

import com.barcode.honeykeep.account.dto.*;
import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pocket.dto.PocketSummaryResponse;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.transaction.service.TransactionService;
import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionService transactionService;

    //이체 하기 전 실행 로직
    //출금 계좌와 입금 계좌를 단순 조회하여 정보를 반환
    public TransferValidationResponse validateTransfer(TransferValidationRequest request, Long userId) {

        //출금 계좌 조회
        Account withdrawalAccount = accountRepository.findById(request.getWithdrawAccountId())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        //출금 계좌 소유자 검증
        if(!withdrawalAccount.getUser().getId().equals(userId)) {
            throw new CustomException(AccountErrorCode.ACCOUNT_ACCESS_DENIED);
        }

        //입금 계좌 조회
        Account depositAccount = accountRepository.findByAccountNumber(request.getDepositAccountNumber())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        return TransferValidationResponse.builder()
                .withdrawAccountId(withdrawalAccount.getId())
                .withdrawAccountName(withdrawalAccount.getAccountName())
                .withdrawAccountBalance(withdrawalAccount.getAccountBalance().getAmount())
                .depositAccountId(depositAccount.getId())
                .depositAccountName(depositAccount.getAccountName())
                .depositAccountBalance(depositAccount.getAccountBalance().getAmount())
                .depositAccountUserName(depositAccount.getUser().getName())
                .build();
    }


    /**
     * 실제 계좌 이체 로직 실행
     * - Pessimistic Lock을 사용하여 출금 계좌와 입금 계좌를 동시에 업데이트
     * - 출금 계좌의 잔액이 충분한지 체크한 후 금액 차감 및 입금 처리를 진행
     */
    @Transactional
    public TransferExecutionResponse executeTransfer(TransferExecutionRequest request, Long userId) {
        // 출금 계좌 조회
        Account withdrawAccount = accountRepository.findAccountForUpdate(request.getWithdrawAccountId())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        // 소유자 검증
        if (!withdrawAccount.getUser().getId().equals(userId)) {
            throw new CustomException(AccountErrorCode.ACCOUNT_ACCESS_DENIED);
        }

        // 입금 계좌 조회 (계좌번호 기준)
        Account depositAccount = accountRepository.findAccountForUpdateByAccountNumber(request.getDepositAccountNumber())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        //이체 금액
        BigDecimal transferAmount = request.getTransferAmount();

        // 잔액 부족 체크
        if (withdrawAccount.getAccountBalance().getAmount().compareTo(transferAmount) < 0) {
            throw new CustomException(AccountErrorCode.INSUFFICIENT_FUNDS);
        }

        // 출금 계좌에서 금액 차감
        BigDecimal newWithdrawBalance = withdrawAccount.getAccountBalance().getAmount().subtract(transferAmount);
        withdrawAccount.updateBalance(new Money(newWithdrawBalance));

        // 입금 계좌에 금액 추가
        BigDecimal newDepositBalance = depositAccount.getAccountBalance().getAmount().add(transferAmount);
        depositAccount.updateBalance(new Money(newDepositBalance));

        // 거래내역 저장: 출금 거래내역 (WITHDRAWAL)
        transactionService.createTransaction(
                withdrawAccount, //출금 계좌
                depositAccount.getUser().getName(), //입금 계좌 사용자 명
                new Money(transferAmount), //출금 금액
                new Money(newWithdrawBalance), //출금 후 남은 금액
                TransactionType.WITHDRAWAL
                );

        // 거래내역 저장: 입금 거래내역 (DEPOSIT)
        transactionService.createTransaction(
                depositAccount,
                withdrawAccount.getUser().getName(),
                new Money(transferAmount),
                new Money(newDepositBalance),
                TransactionType.DEPOSIT
        );



        return TransferExecutionResponse.builder()
                .withdrawAccountId(withdrawAccount.getId())
                .withdrawAccountNewBalance(newWithdrawBalance)
                .depositAccountId(depositAccount.getId())
                .depositAccountNewBalance(newDepositBalance)
                .message("Transfer successful")
                .build();
    }



    public List<AccountResponse> getAccountsByUserId(Long userId) {
        List<Account> accounts = accountRepository.findByUser_Id(userId);

        return accounts.stream().map(account -> {
            return AccountResponse.builder()
                    .accountNumber(account.getAccountNumber())
                    .accountBalance(account.getAccountBalance().getAmount())
                    .accountName(account.getAccountName())
                    .bankName(account.getBank().getName())
                    .totalPocketAmount(calculateTotalPocketAmount(account))
                    .pocketCount(account.getPockets().size())
                    .build();
        }).collect(Collectors.toList());
    }


    public AccountDetailResponse getAccountDetailById(Long id, Long userId) {
        Account account = getAccountById(id);
        validateAccountOwner(account, userId);

        // Pocket 엔티티를 DTO로 변환
        List<PocketSummaryResponse> pocketDtos = account.getPockets().stream()
                .map(pocket -> PocketSummaryResponse.builder()
                        .id(pocket.getId())
                        .name(pocket.getName())
                        .accountName(account.getAccountName())
                        .totalAmount(pocket.getTotalAmount().getAmountAsLong())
                        .savedAmount(pocket.getSavedAmount().getAmountAsLong())
                        .type(pocket.getType().getType())
                        .isFavorite(pocket.getIsFavorite())
                        .imgUrl(pocket.getImgUrl())
                        .endDate(pocket.getEndDate())
                        .build())
                .collect(Collectors.toList());

        return AccountDetailResponse.builder()
                .accountNumber(account.getAccountNumber())
                .accountBalance(account.getAccountBalance().getAmount())
                .bankName(account.getBank().getName())
                .accountName(account.getAccountName())
                .totalPocketAmount(calculateTotalPocketAmount(account))
                .pocketCount(account.getPockets().size())
                .transactionList(account.getTransactions())
                .pocketList(pocketDtos)
                .build();
    }

    /**
     * ID로 계좌 조회
     */
    public Account getAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));
    }

    /**
     * 계좌 소유자 검증
     */
    public void validateAccountOwner(Account account, Long userId) {
        if (!account.getUser().getId().equals(userId)) {
            throw new CustomException(AccountErrorCode.ACCOUNT_ACCESS_DENIED);
        }
    }

    //포켓들 금액 합 계산
    private BigDecimal calculateTotalPocketAmount(Account account) {
        BigDecimal total = BigDecimal.ZERO;

        for (Pocket pocket : account.getPockets()) {
            total = total.add(pocket.getSavedAmount().getAmount());
        }
        return total;
    }

}