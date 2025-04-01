package com.barcode.honeykeep.cert.service;

import java.io.InputStream;
import java.io.StringWriter;
import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Security;
import java.security.cert.X509Certificate;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import org.bouncycastle.asn1.x500.X500Name;
import org.bouncycastle.asn1.x509.BasicConstraints;
import org.bouncycastle.asn1.x509.Extension;
import org.bouncycastle.asn1.x509.GeneralName;
import org.bouncycastle.asn1.x509.GeneralNames;
import org.bouncycastle.asn1.x509.KeyUsage;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.X509v3CertificateBuilder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.cert.jcajce.JcaX509v3CertificateBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.jcajce.JcaPEMWriter;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.common.vo.UserId;
import com.barcode.honeykeep.transaction.entity.Transaction;
import com.barcode.honeykeep.transaction.repository.TransactionRepository;
import com.barcode.honeykeep.transaction.type.TransactionType;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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

    // CA 관련 설정
    @Value("${cert.ca.keystore.path:classpath:certs/ca-keystore.p12}")
    private String caKeystorePath;

    @Value("${cert.ca.keystore.password}")
    private String caKeystorePassword;

    @Value("${cert.ca.key.alias}")
    private String caKeyAlias;

    @PostConstruct
    public void init() {
        // Bouncy Castle 프로바이더 등록
        Security.addProvider(new BouncyCastleProvider());
    }

    /**
     * 인증서 등록 메서드 - 공개키를 받아 인증서를 생성하고 저장
     *
     * @param userId  사용자 ID
     * @param request 공개키가 포함된 요청
     * @return 생성된 인증서 정보
     */
    @Transactional
    public RegisterCertificateResponse registerCertificate(UserId userId, RegisterCertificateRequest request) {
        // 1. 사용자 확인 및 기본 검증 (기존 코드 유지)
        User user = userRepository.findById(userId.value())
                .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

        if (certRepository.existsByUserIdAndStatusNot(userId.value(), Cert.CertStatus.REVOKED)) {
            throw new CustomException(CertErrorCode.CERTIFICATE_ALREADY_EXISTS);
        }

        if (request.publicKey() == null || request.publicKey().isBlank()) {
            throw new CustomException(CertErrorCode.INVALID_PUBLIC_KEY);
        }

        try {
            // 2. 공개키 디코딩
            PublicKey publicKey = decodePublicKey(request.publicKey());

            // 3. CA 키스토어에서 CA 개인키 및 인증서 로드
            KeyStore caKeyStore = loadCAKeystore();
            PrivateKey caPrivateKey = (PrivateKey) caKeyStore.getKey(
                    caKeyAlias, caKeystorePassword.toCharArray());
            X509Certificate caCertificate = (X509Certificate) caKeyStore.getCertificate(caKeyAlias);

            // 4. 인증서 일련번호 생성
            BigInteger serialNumber = generateUniqueSerialNumber();

            // 5. 인증서 주체 생성 (사용자 정보 기반)
            X500Name subject = new X500Name(String.format(
                    "CN=%s, UID=%d, O=HoneyKeep Users",
                    user.getName(), user.getId()));

            // 6. 인증서 발행자 정보 (CA 인증서에서 추출)
            X500Name issuer = new X500Name(caCertificate.getSubjectX500Principal().getName());

            // 7. 인증서 유효기간 설정
            Date notBefore = new Date(); // 현재 시점부터
            Calendar calendar = Calendar.getInstance();
            calendar.add(Calendar.YEAR, 1); // 1년 유효
            Date notAfter = calendar.getTime();

            // 8. 인증서 빌더 생성
            X509v3CertificateBuilder certBuilder = new JcaX509v3CertificateBuilder(
                    issuer,
                    serialNumber,
                    notBefore,
                    notAfter,
                    subject,
                    publicKey
            );

            // 9. 인증서 확장 필드 추가
            // 9-1. 기본 제약 사항 (End Entity 인증서)
            certBuilder.addExtension(
                    Extension.basicConstraints,
                    true,
                    new BasicConstraints(false)
            );

            // 9-2. 키 사용 목적 (전자서명)
            certBuilder.addExtension(
                    Extension.keyUsage,
                    true,
                    new KeyUsage(KeyUsage.digitalSignature | KeyUsage.nonRepudiation)
            );

            // 9-3. 주체 대체 이름 (사용자 이메일 추가)
            if (user.getEmail() != null) {
                GeneralName[] names = {new GeneralName(GeneralName.rfc822Name, user.getEmail())};
                certBuilder.addExtension(
                        Extension.subjectAlternativeName,
                        false,
                        new GeneralNames(names)
                );
            }

            // 10. CA 개인키로 인증서 서명
            ContentSigner signer = new JcaContentSignerBuilder("SHA256withRSA")
                    .setProvider(BouncyCastleProvider.PROVIDER_NAME)
                    .build(caPrivateKey);

            X509CertificateHolder certHolder = certBuilder.build(signer);

            // 11. 최종 X.509 인증서 생성
            X509Certificate certificate = new JcaX509CertificateConverter()
                    .setProvider(BouncyCastleProvider.PROVIDER_NAME)
                    .getCertificate(certHolder);

            // 12. 인증서 유효성 검증
            certificate.verify(caCertificate.getPublicKey());

            // 13. 인증서를 PEM 형식으로 변환
            String certificatePem = convertToPem(certificate);

            // 14. DB에 인증서 정보 저장
            Cert cert = Cert.builder()
                    .user(user)
                    .certificateData(certificatePem)
                    .publicKey(request.publicKey())
                    .serialNumber(serialNumber.toString(16).toUpperCase())
                    .issueDate(LocalDateTime.now())
                    .expiryDate(LocalDateTime.ofInstant(notAfter.toInstant(), ZoneId.systemDefault()))
                    .status(Cert.CertStatus.ACTIVE)
                    .issuer("CN=HoneyKeep CA, O=HoneyKeep, C=KR")
                    .isAccountVerified(true)
                    .build();

            // 15. 저장 및 응답 생성
            cert = certRepository.save(cert);

            return new RegisterCertificateResponse(
                    cert.getId(),
                    cert.getSerialNumber(),
                    cert.getExpiryDate(),
                    cert.getStatus().name()
            );

        } catch (Exception e) {
            log.error("인증서 생성 오류", e);
            throw new CustomException(CertErrorCode.CERTIFICATE_GENERATION_FAILED);
        }
    }

    /**
     * 공개키 Base64 디코딩 유틸리티
     */
    private PublicKey decodePublicKey(String publicKeyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(publicKeyBase64);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }

    /**
     * 고유한 인증서 일련번호 생성
     */
    private BigInteger generateUniqueSerialNumber() {
        SecureRandom random = new SecureRandom();
        byte[] serialBytes = new byte[16]; // 128비트
        random.nextBytes(serialBytes);
        return new BigInteger(1, serialBytes);
    }

    /**
     * 인증서를 PEM 형식으로 변환
     */
    private String convertToPem(X509Certificate certificate) throws Exception {
        StringWriter stringWriter = new StringWriter();
        try (JcaPEMWriter pemWriter = new JcaPEMWriter(stringWriter)) {
            pemWriter.writeObject(certificate);
        }
        return stringWriter.toString();
    }

    /**
     * CA 키스토어 로드
     */
    private KeyStore loadCAKeystore() throws Exception {
        KeyStore keyStore = KeyStore.getInstance("PKCS12");

        // classpath: 접두사 처리
        String path = caKeystorePath;
        if (path.startsWith("classpath:")) {
            path = path.substring("classpath:".length());
        }

        Resource resource = new ClassPathResource(path);

        // 리소스 존재 여부 확인 로깅
        if (!resource.exists()) {
            log.error("CA 키스토어 파일을 찾을 수 없습니다: {}", caKeystorePath);
            throw new Exception("CA 키스토어 파일을 찾을 수 없습니다: " + caKeystorePath);
        }

        log.info("CA 키스토어 파일 로드 시도: {}", resource.getURL());

        try (InputStream inputStream = resource.getInputStream()) {
            keyStore.load(inputStream, caKeystorePassword.toCharArray());
            log.info("CA 키스토어 파일 로드 성공");
        } catch (Exception e) {
            log.error("CA 키스토어 파일 로드 실패: {}", e.getMessage(), e);
            throw e;
        }

        return keyStore;
    }
}
