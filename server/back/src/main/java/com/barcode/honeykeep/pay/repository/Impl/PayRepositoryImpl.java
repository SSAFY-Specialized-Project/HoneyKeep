package com.barcode.honeykeep.pay.repository.Impl;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.repository.PayRepository;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Transactional
@RequiredArgsConstructor
@Repository
public class PayRepositoryImpl implements PayRepository {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
//    private final PocketRepository pocketRepository;

    @Override
    public boolean payment(UserId userId, PayRequest payRequest) {
        // 1. 실제 있는 계좌인지 조회
        Account account = accountRepository.findByAccountNumberWithLock(payRequest.getAccount());
        if(account == null) {
            return false;
        }

        // 2. 계좌에서 결제 금액만큼 차감
        BigDecimal currentBalance = account.getAccountBalance().getAmount();
        BigDecimal payAmount = payRequest.getAmount();

        if(currentBalance.compareTo(payAmount) < 0) {
            return false;
        }

        // 3. 잔액 차감 및 업데이트
        BigDecimal newBalance = currentBalance.subtract(payAmount);
        account.updateBalance(new Money(newBalance));

        // 4. 포켓 금액 차감
        // Pocket pocket = ;

        // 5. 결제 기록 생성
        Transaction transaction = Transaction.builder()
                .account(account)
                // .pocket(Pocket)
                .name(payRequest.getProductName())
                .amount(new Money(payAmount))
                .balance(new Money(newBalance))
                .date(LocalDateTime.now())
                .type(TransactionType.WITHDRAWAL)
                .build();

        transactionRepository.save(transaction);

        return true;
    }

}
