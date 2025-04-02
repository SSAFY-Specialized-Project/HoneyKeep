package com.barcode.honeykeep.cert.service;

import com.barcode.honeykeep.cert.entity.Cert;
import com.barcode.honeykeep.cert.exception.CertErrorCode;
import com.barcode.honeykeep.cert.repository.CertRepository;
import com.barcode.honeykeep.common.exception.CustomException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.Signature;
import java.security.spec.MGF1ParameterSpec;
import java.security.spec.PSSParameterSpec;
import java.security.spec.X509EncodedKeySpec;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class SignatureVerificationService {
    private final CertRepository certRepository;
    private final ObjectMapper objectMapper;

    /**
     * 클라이언트의 서명 검증
     * @param userId 사용자 ID
     * @param data 원본 데이터
     * @param signature 서명 데이터 (Base64)
     * @return 서명 유효성 여부
     */
    public boolean verifySignature(Long userId, String data, String signature) {
        try {
            // 1. 사용자 인증서 조회
            Cert cert = certRepository.findByUserIdAndStatus(userId, Cert.CertStatus.ACTIVE)
                    .orElseThrow(() -> new CustomException(CertErrorCode.CERTIFICATE_NOT_FOUND));

            // 2. 인증서 유효기간 확인
            if (LocalDateTime.now().isAfter(cert.getExpiryDate())) {
                cert.updateStatus(Cert.CertStatus.EXPIRED);
                certRepository.save(cert);
                throw new CustomException(CertErrorCode.CERTIFICATE_EXPIRED);
            }

            // 3. 공개키 추출
            PublicKey publicKey = decodePublicKey(cert.getPublicKey());

            // 4. 서명 데이터 Base64 디코딩
            byte[] signatureBytes = Base64.getDecoder().decode(signature);

            // 5. 서명 검증
            Signature verifier = Signature.getInstance("RSASSA-PSS");
            verifier.setParameter(new PSSParameterSpec("SHA-256", "MGF1", MGF1ParameterSpec.SHA256, 32, 1));
            verifier.initVerify(publicKey);
            verifier.update(data.getBytes(StandardCharsets.UTF_8));

            boolean isValid = verifier.verify(signatureBytes);

            // 6. 검증 결과가 유효하면 마지막 사용 시간 업데이트
            if (isValid) {
                cert.updateLastUsed();
                certRepository.save(cert);
            }

            return isValid;
        } catch (Exception e) {
            log.error("서명 검증 오류", e);
            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
        }
    }

    /**
     * 객체 데이터에 대한 전자서명 검증
     * @param userId 사용자 ID
     * @param data 요청 객체 (DTO)
     * @param signature 서명 데이터 (Base64)
     * @return 서명 유효성 여부
     */
    public boolean verifySignature(Long userId, Object data, String signature) {
        try {
            // 객체를 JSON 문자열로 변환
            String dataString = objectMapper.writeValueAsString(data);

            // 기존 메서드 호출하여 검증
            return verifySignature(userId, dataString, signature);
        } catch (Exception e) {
            log.error("객체 서명 검증 오류", e);
            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
        }
    }

    /**
     * Map 데이터를 이용한 전자서명 검증
     * @param userId 사용자 ID
     * @param signature 서명 데이터 (Base64)
     * @param dataMap 검증할 데이터 맵
     * @return 서명 유효성 여부
     */
    public boolean verifySignature(Long userId, String signature, Map<String, Object> dataMap) {
        try {
            // Map을 JSON 문자열로 변환
            String dataString = objectMapper.writeValueAsString(dataMap);

            // 기존 메서드 호출하여 검증
            return verifySignature(userId, dataString, signature);
        } catch (Exception e) {
            log.error("Map 서명 검증 오류", e);
            throw new CustomException(CertErrorCode.SIGNATURE_VERIFICATION_FAILED);
        }
    }

    private PublicKey decodePublicKey(String publicKeyBase64) throws Exception {
        byte[] keyBytes = Base64.getDecoder().decode(publicKeyBase64);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }
}