package com.barcode.honeykeep.cert.service;

import com.barcode.honeykeep.account.entity.Account;
import com.barcode.honeykeep.account.exception.AccountErrorCode;
import com.barcode.honeykeep.account.repository.AccountRepository;
import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.auth.exception.AuthErrorCode;
import com.barcode.honeykeep.cert.dto.AccountConfirmRequest;
import com.barcode.honeykeep.cert.dto.AccountVerificationRequest;
import com.barcode.honeykeep.cert.dto.RegisterCertificateRequest;
import com.barcode.honeykeep.cert.dto.RegisterCertificateResponse;
import com.barcode.honeykeep.cert.entity.Cert;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Slf4j
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

    /**
     * 인증서 등록 메서드 - 공개키를 받아 인증서를 생성하고 저장
     * @param userId 사용자 ID
     * @param request 공개키가 포함된 요청
     * @return 생성된 인증서 정보
     */
    @Transactional
    public RegisterCertificateResponse registerCertificate(UserId userId, RegisterCertificateRequest request) {
        // 1. 사용자 존재 확인
        User user = userRepository.findById(userId.value())
                .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));
        
        // 2. 이미 발급된 인증서 확인
        if (certRepository.existsByUserIdAndStatusNot(userId.value(), Cert.CertStatus.REVOKED)) {
            throw new CustomException(CertErrorCode.CERTIFICATE_ALREADY_EXISTS);
        }
        
        // 3. 공개키 형식 검증
        if (request.publicKey() == null || request.publicKey().isBlank()) {
            throw new CustomException(CertErrorCode.INVALID_PUBLIC_KEY);
        }
        
        // 4. 일련번호 생성
        String serialNumber = generateSerialNumber();
        
        // 5. 인증서 생성
        Cert cert = Cert.builder()
                .user(user)
                .publicKey(request.publicKey())
                .serialNumber(serialNumber)
                .issueDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusYears(1)) // 1년 유효
                .status(Cert.CertStatus.ACTIVE)
                .issuer("HoneyKeep CA")
                .isAccountVerified(true)
                .build();
        
        // 6. 인증서 저장
        cert = certRepository.save(cert);
        
        // 7. 응답 생성
        return new RegisterCertificateResponse(
                cert.getId(),
                cert.getSerialNumber(),
                cert.getExpiryDate(),
                cert.getStatus().name()
        );
    }
    
    /**
     * 인증서 일련번호 생성
     */
    private String generateSerialNumber() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        return new BigInteger(1, bytes).toString(16).toUpperCase();
    }
}
