package com.barcode.honeykeep.pay.repository.Impl;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.notification.dto.PayNotificationDTO;
import com.barcode.honeykeep.notification.service.NotificationDispatcher;
import com.barcode.honeykeep.notification.type.PushType;
import com.barcode.honeykeep.pay.dto.PayDto;
import com.barcode.honeykeep.pay.dto.PayRequest;
import com.barcode.honeykeep.pay.dto.PocketBalanceResult;
import com.barcode.honeykeep.pay.exception.PayErrorCode;
import com.barcode.honeykeep.pay.repository.PayRepository;
import com.barcode.honeykeep.pocket.entity.Pocket;
import com.barcode.honeykeep.pocket.repository.PocketRepository;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.type.TransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Repository
@Slf4j
public class PayRepositoryImpl implements PayRepository {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final PocketRepository pocketRepository;
    private final NotificationDispatcher notificationDispatcher;

    @Override
    public PocketBalanceResult payment(UserId userId, PayDto payDto) {
        boolean isSuccess = false;
        boolean isExceedPocketBalance = false;

        // 1. 실제 있는 계좌인지 조회
        Account account = accountRepository.findAccountForUpdate(payDto.getAccountId()).orElse(null);
        log.info("결제 Repository 진입, userId: {}, account: {}", userId, payDto.getAccountId());

        if(account == null) {
            log.error("유효하지 않은 계좌 번호: {}", payDto.getAccountId());
            throw new CustomException(PayErrorCode.INVALID_ACCOUNT);
        }

        // 2. 계좌에서 결제 금액만큼 차감
        BigDecimal currentBalance = account.getAccountBalance().getAmount();
        BigDecimal payAmount = payDto.getAmount();

        if(currentBalance.compareTo(payAmount) < 0) {
            log.error("계좌 잔액 부족: 현재 계좌 잔액 = {}, 결제 요청 금액 = {}", currentBalance, payAmount);
            throw new CustomException(PayErrorCode.INSUFFICIENT_BALANCE);
        }

        // 3. 잔액 차감 및 업데이트
        BigDecimal newBalance = currentBalance.subtract(payAmount);
        account.updateBalance(new Money(newBalance));
        log.info("계좌 잔액 업데이트 완료, 이전 잔액 = {}, 새로운 잔액 = {}", currentBalance, newBalance);

        // 4. 포켓 조회
        Pocket pocket = pocketRepository.findById(payDto.getPocketId()).orElse(null);

        if(pocket == null) {
            log.error("유효하지 않은 포켓ID: {}", payDto.getPocketId());
            throw new CustomException(PayErrorCode.INVALID_POCKET);
        }

        // 5. 포켓 금액 차감
        BigDecimal currentPocketBalance = pocket.getSavedAmount().getAmount();
        BigDecimal newPocketBalance;

        // 포켓 잔액 여부
        if(currentPocketBalance.compareTo(payAmount) < 0) {
            log.warn("포켓 잔액 부족: 현재 포켓 잔액 = {}, 결제 요청 금액 = {}", currentPocketBalance, payAmount);
            isExceedPocketBalance = true;
            newPocketBalance = BigDecimal.ZERO;
            pocket.updateIsExceed(true);
        } else {
            newPocketBalance = currentPocketBalance.subtract(payAmount);
        }

        // 잔액 업데이트
        pocket.updateSavedAmount(new Money(newPocketBalance));

        // 6. 결제 기록 생성
        Transaction transaction = Transaction.builder()
                .account(account)
                .pocket(pocket)
                .name(payDto.getProductName())
                .amount(new Money(payAmount))
                .balance(new Money(newBalance))
                .date(LocalDateTime.now())
                .type(TransactionType.WITHDRAWAL)
                .build();

        transactionRepository.save(transaction);
        log.info("결제 거래 기록 저장 완료, transactionId: {}", transaction.getId());


        //알림 요청 로직
        PayNotificationDTO payNotificationDTO =PayNotificationDTO.builder()
                .transactionType(TransactionType.WITHDRAWAL)
                .amount(payAmount)
                .withdrawAccountName(account.getAccountName())
                .productName(payDto.getProductName())
                .transferDate(LocalDateTime.now())
                .build();
        //결제 완료 시 알림
        notificationDispatcher.send(PushType.PAYMENT, userId.value(), payNotificationDTO);


        isSuccess = true;
        return PocketBalanceResult.builder()
                .isSuccess(isSuccess)
                .isExceedPocketBalance(isExceedPocketBalance)
                .build();
    }
}
