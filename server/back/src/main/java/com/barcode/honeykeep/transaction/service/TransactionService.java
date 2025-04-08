package com.barcode.honeykeep.transaction.service;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.pocket.service.PocketService;
import com.barcode.honeykeep.transaction.exception.TransactionErrorCode;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.transaction.dto.TransactionDetailResponse;
import com.barcode.honeykeep.transaction.dto.TransactionListResponse;
import com.barcode.honeykeep.transaction.dto.TransactionMemoRequest;
import com.barcode.honeykeep.transaction.dto.TransactionMemoResponse;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional(readOnly = true)
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final PocketService pocketService;

    public TransactionService(
            TransactionRepository transactionRepository,
            AccountRepository accountRepository,
            @Lazy PocketService pocketService) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
        this.pocketService = pocketService;
    }

    /**
     * 거래내역 목록 조회
     */
    public TransactionListResponse getTransactions(Long userId, Long accountId) {
        // 계좌 ID 유효성 검사
        if (accountId == null || accountId <= 0) {
            throw new CustomException(TransactionErrorCode.INVALID_ACCOUNT_ID);
        }

        // 계좌 존재 여부 확인
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new CustomException(TransactionErrorCode.ACCOUNT_NOT_FOUND));

        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByDateDesc(accountId);

        List<TransactionListResponse.Transaction> transactionDtos = transactions.stream()
                .map(this::mapToTransactionDto)
                .collect(Collectors.toList());

        return TransactionListResponse.builder()
                .transactions(transactionDtos)
                .build();
    }

    /**
     * 거래내역 상세 조회
     */
    public TransactionDetailResponse getTransaction(Long userId, Long transactionId) {
        Transaction transaction = getTransactionById(transactionId);
        return mapToTransactionDetailResponse(transaction);
    }

    /**
     * 거래내역 메모 업데이트
     */
    @Transactional
    public TransactionMemoResponse updateTransactionMemo(Long userId, Long transactionId, TransactionMemoRequest request) {
        Transaction transaction = getTransactionById(transactionId);
        transaction.updateMemo(request.memo());
        Transaction savedTransaction = transactionRepository.save(transaction);

        return TransactionMemoResponse.builder()
                .id(savedTransaction.getId())
                .memo(savedTransaction.getMemo())
                .build();
    }

    /**
     * ID로 거래내역 조회하는 헬퍼 메서드
     */
    public Transaction getTransactionById(Long transactionId) {
        return transactionRepository.findById(transactionId)
                .orElseThrow(() -> new CustomException(TransactionErrorCode.TRANSACTION_NOT_FOUND));
    }

    /**
     * Transaction 엔티티를 TransactionListResponse.Transaction DTO로 변환
     */
    private TransactionListResponse.Transaction mapToTransactionDto(Transaction transaction) {
        return TransactionListResponse.Transaction.builder()
                .id(transaction.getId())
                .name(transaction.getName())
                .amount(transaction.getAmount().getAmountAsLong())
                .balance(transaction.getBalance().getAmountAsLong())
                .date(transaction.getDate())
                .type(transaction.getType())
                .build();
    }

    /**
     * Transaction 엔티티를 TransactionDetailResponse DTO로 변환
     */
    private TransactionDetailResponse mapToTransactionDetailResponse(Transaction transaction) {
        Account account = transaction.getAccount();

        return TransactionDetailResponse.builder()
                .id(transaction.getId())
                .name(transaction.getName())
                .amount(transaction.getAmount().getAmountAsLong())
                .balance(transaction.getBalance().getAmountAsLong())
                .date(transaction.getDate())
                .type(transaction.getType())
                .accountId(account != null ? account.getId() : null)
                .accountName(account != null ? account.getAccountName() : null)
                .memo(transaction.getMemo())
                .build();
    }

    /**
     * 거래내역 생성
     * 결제 서비스 등 다른 서비스에서 사용하기 위한 메서드
     */
    @Transactional
    public Transaction createTransaction(Account account,
                                         Pocket pocket,
                                         String name,
                                         Money amount,
                                         Money balance,
                                         LocalDateTime date,
                                         TransactionType type) {

        Transaction transaction = Transaction.builder()
                .account(account)
                .pocket(pocket)
                .name(name)
                .amount(amount)
                .balance(balance)
                .date(date)
                .type(type)
                .build();

        return transactionRepository.save(transaction);
    }

    /**
     * 거래내역 생성 (포켓 없이 계좌만 사용하는 경우)
     */
    @Transactional
    public Transaction createTransaction(Account account,
                                         String name,
                                         Money amount,
                                         Money balance,
                                         TransactionType type) {

        Transaction transaction = createTransaction(account, null, name, amount, balance, LocalDateTime.now(), type);

        pocketService.updatePocketsActivationStatus(account.getId());

        return transaction;
    }

    /**
     * 거래내역 생성 (포켓 사용하는 경우)
     */
    @Transactional
    public Transaction createTransaction(Account account,
                                         Pocket pocket,
                                         String name,
                                         Money amount,
                                         Money balance,
                                         TransactionType type) {

        return createTransaction(account, pocket, name, amount, balance, LocalDateTime.now(), type);
    }

    /**
     * 거래내역 저장
     */
    @Transactional
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
}