package com.barcode.honeykeep.cert.service;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.cert.dto.AccountConfirmRequest;
import com.barcode.honeykeep.cert.dto.AccountVerificationRequest;
import com.barcode.honeykeep.cert.exception.CertErrorCode;
import com.barcode.honeykeep.cert.repository.CertRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.exception.ErrorCode;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.transaction.type.TransactionType;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CertService {
    private final CertRepository certRepository;
    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional
    public void sendTransferCode(UserId userId, AccountVerificationRequest request) {
        User user = userRepository.findById(userId.value())
                .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

        Account account = accountRepository.findByAccountNumberAndBank_Code(request.accountNumber(), request.bankCode())
                .orElseThrow(() -> new CustomException(AccountErrorCode.ACCOUNT_NOT_FOUND));

        // 더티 체킹
        Money newBalance = account.getAccountBalance().add(Money.of(1));
        account.updateBalance(newBalance);

        // 4자리 랜덤 숫자 생성
        Random random = new Random();
        String code = (1000 + random.nextInt(9000)) + "";

        // redis에 인증 코드 저장(3분 만료)
        String redisKey = "penny:verification:" + userId.value();
        redisTemplate.opsForValue().set(
                redisKey,
                code,
                3,
                TimeUnit.MINUTES
        );

        // 1원 송금 트랜잭션 생성
        Transaction transaction = Transaction.builder()
                .account(account)
                .name(code)
                .amount(Money.of(1))
                .balance(account.getAccountBalance())
                .date(LocalDateTime.now())
                .type(TransactionType.DEPOSIT)
                .memo("1원 인증")
                .build();

        transactionRepository.save(transaction);
    }

    public void confirmTransferCode(UserId userId, AccountConfirmRequest request) {
        String redisKey = "penny:verification:" + userId.value();
        String storedCode = String.valueOf(redisTemplate.opsForValue().get(redisKey));

        if (storedCode.equals("null")) {
            throw new CustomException(AuthErrorCode.VERIFICATION_CODE_EXPIRED);
        }

        boolean isValid = storedCode.equals(request.code());

        if (!isValid) {
            throw new CustomException(AuthErrorCode.INVALID_VERIFICATION_CODE);
        }

        redisTemplate.delete(redisKey);
    }
}
