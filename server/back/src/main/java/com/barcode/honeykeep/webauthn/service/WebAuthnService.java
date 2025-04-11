package com.barcode.honeykeep.webauthn.service;

import com.barcode.honeykeep.auth.entity.User;
import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.user.exception.UserErrorCode;
import com.barcode.honeykeep.user.repository.UserRepository;
import com.barcode.honeykeep.webauthn.dto.*;
import com.barcode.honeykeep.webauthn.entity.WebAuthnCredential;
import com.barcode.honeykeep.webauthn.entity.WebAuthnCredential.CredentialStatus;
import com.barcode.honeykeep.webauthn.entity.WebAuthnSession;
import com.barcode.honeykeep.webauthn.repository.WebAuthnCredentialRepository;
import com.barcode.honeykeep.webauthn.repository.WebAuthnSessionRepository;
import com.barcode.honeykeep.webauthn.util.WebAuthnUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.exception.AssertionFailedException;
import com.yubico.webauthn.exception.RegistrationFailedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebAuthnService {

    private final WebAuthnCredentialRepository credentialRepository;
    private final WebAuthnSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Value("${webauthn.rp.id}")
    private String rpId;

    @Value("${webauthn.rp.name}")
    private String rpName;

    @Value("${webauthn.rp.origin}")
    private String rpOrigin;

    /**
     * WebAuthn 등록 시작
     * 1. 사용자 정보 가져오기
     * 2. 기존 인증 키 찾기
     * 3. 등록 옵션 생성
     * 4. 세션에 등록 옵션 저장
     * 5. 클라이언트에 등록 옵션 반환
     */
    public WebAuthnResponse<?> startRegistration(RegistrationRequest request) {
        try {
            log.info("WebAuthn 등록 시작: userId={}, displayName={}", request.userId(), request.displayName());

            // 1. 사용자 정보 가져오기
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

            // 2. 기존 인증 키 찾기 (삭제된 것 제외)
            List<WebAuthnCredential> existingCredentials = credentialRepository.findAllByUserIdAndStatusNot(
                    user.getId(), WebAuthnCredential.CredentialStatus.REVOKED);

            // 3. 실행 컨텍스트 생성 (RelyingParty)
            RelyingParty relyingParty = getRelyingParty();

            // 4. 사용자 인증 정보 생성
            ByteArray userHandle = WebAuthnUtils.createUserHandle(user.getId().toString());

            UserIdentity userIdentity = UserIdentity.builder()
                    .name(user.getEmail())
                    .displayName(request.displayName() == null ? user.getName() : request.displayName())
                    .id(userHandle)
                    .build();

            // 5. 제외할 기존 인증정보 목록 생성
            List<PublicKeyCredentialDescriptor> excludeCredentials = existingCredentials.stream()
                    .map(cred -> PublicKeyCredentialDescriptor.builder()
                            .id(WebAuthnUtils.base64UrlDecodeToByteArray(cred.getCredentialId()))
                            .type(PublicKeyCredentialType.PUBLIC_KEY)
                            .transports(Set.of(AuthenticatorTransport.USB, AuthenticatorTransport.NFC, AuthenticatorTransport.INTERNAL))
                            .build())
                    .toList();

            // 6. 인증기기 선택 옵션 설정
            AuthenticatorSelectionCriteria.AuthenticatorSelectionCriteriaBuilder selectionBuilder =
                    AuthenticatorSelectionCriteria.builder();

            // authenticatorAttachment 설정
            if (request.authenticatorAttachment() != null) {
                try {
                    AuthenticatorAttachment attachment = AuthenticatorAttachment.valueOf(
                            request.authenticatorAttachment().toUpperCase());
                    selectionBuilder.authenticatorAttachment(attachment);
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 authenticatorAttachment 값: {}", request.authenticatorAttachment());
                }
            }

            // 기본 설정 적용
            AuthenticatorSelectionCriteria selectionCriteria = selectionBuilder
                    .residentKey(ResidentKeyRequirement.PREFERRED)
                    .userVerification(UserVerificationRequirement.PREFERRED)
                    .build();

            // 7. 등록 옵션 생성
            StartRegistrationOptions registrationOptions = StartRegistrationOptions.builder()
                    .user(userIdentity)
                    .timeout(120000L) // 2분
                    .authenticatorSelection(selectionCriteria)
                    .build();

            PublicKeyCredentialCreationOptions options = relyingParty.startRegistration(registrationOptions);

            // 8. 세션에 등록 옵션 저장
            String sessionId = UUID.randomUUID().toString();
            WebAuthnSession session = WebAuthnSession.builder()
                    .id(sessionId)
                    .userId(user.getId())
                    .challenge(WebAuthnUtils.base64UrlEncode(options.getChallenge()))
                    .operation("REGISTRATION")
                    .requestJson(objectMapper.writeValueAsString(options))
                    .clientIp(getClientIp())
                    .userAgent(getUserAgent())
                    .createdAt(System.currentTimeMillis())
                    .build();

            sessionRepository.save(session);
            log.info("등록 세션 생성: sessionId={}", sessionId);

            // 9. 클라이언트 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("rp", Map.of(
                    "id", options.getRp().getId(),
                    "name", options.getRp().getName()
            ));

            response.put("user", Map.of(
                    "id", WebAuthnUtils.base64UrlEncode(options.getUser().getId()),
                    "name", options.getUser().getName(),
                    "displayName", options.getUser().getDisplayName()
            ));

            response.put("challenge", WebAuthnUtils.base64UrlEncode(options.getChallenge()));

            List<Map<String, Object>> pubKeyCredParams = options.getPubKeyCredParams().stream()
                    .map(param -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("type", param.getType().getId());
                        map.put("alg", param.getAlg().getId());
                        return map;
                    })
                    .toList();

            if (!excludeCredentials.isEmpty()) {
                List<Map<String, Object>> excludeList = excludeCredentials.stream()
                        .map(cred -> {
                            Map<String, Object> exclude = new HashMap<>();
                            exclude.put("type", cred.getType().getId());
                            exclude.put("id", WebAuthnUtils.base64UrlEncode(cred.getId()));
                            if (cred.getTransports().isPresent()) {
                                exclude.put("transports", cred.getTransports().get());
                            }
                            return exclude;
                        })
                        .toList();
                response.put("excludeCredentials", excludeList);
            }

            Map<String, Object> authenticatorSelection = new HashMap<>();
            if (selectionCriteria.getAuthenticatorAttachment().isPresent()) {
                authenticatorSelection.put("authenticatorAttachment",
                        selectionCriteria.getAuthenticatorAttachment().get().getValue());
            }
            authenticatorSelection.put("residentKey", selectionCriteria.getResidentKey().get().getValue());
            authenticatorSelection.put("userVerification", selectionCriteria.getUserVerification().get().getValue());
            response.put("authenticatorSelection", authenticatorSelection);

            response.put("timeout", options.getTimeout());
            response.put("attestation", options.getAttestation().getValue());

            return WebAuthnResponse.success(response, sessionId);

        } catch (Exception e) {
            log.error("WebAuthn 등록 시작 오류", e);
            return WebAuthnResponse.error("등록 시작 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * WebAuthn 등록 완료
     * 1. 세션 정보 가져오기
     * 2. 클라이언트 응답 데이터 파싱
     * 3. 등록 완료 요청 생성
     * 4. 등록 완료 처리
     * 5. 인증정보 저장
     * 6. 세션 삭제
     * 7. 결과 반환
     */
    @Transactional
    public WebAuthnResponse<?> finishRegistration(RegistrationFinishRequest request) {
        try {
            log.info("WebAuthn 등록 완료 시작: sessionId={}", request.sessionId());

            // 1. 세션 정보 가져오기
            WebAuthnSession session = sessionRepository.findById(request.sessionId())
                    .orElseThrow(() -> new IllegalArgumentException("등록 세션을 찾을 수 없습니다: " + request.sessionId()));

            if (!"REGISTRATION".equals(session.getOperation())) {
                throw new IllegalStateException("잘못된 세션 작업: " + session.getOperation());
            }

            // 2. 사용자 정보 가져오기
            User user = userRepository.findById(session.getUserId())
                    .orElseThrow(() -> new CustomException(UserErrorCode.USER_NOT_FOUND));

            // 3. 실행 컨텍스트 생성
            RelyingParty relyingParty = getRelyingParty();

            // 4. 클라이언트 응답 데이터 파싱
            PublicKeyCredentialCreationOptions requestOptions = objectMapper.readValue(
                    session.getRequestJson(), PublicKeyCredentialCreationOptions.class);

            String clientDataJson = objectMapper.writeValueAsString(request.credential());
            PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc =
                    PublicKeyCredential.parseRegistrationResponseJson(clientDataJson);

            // 5. 등록 완료 요청 생성
            FinishRegistrationOptions finishOptions = FinishRegistrationOptions.builder()
                    .request(requestOptions)
                    .response(pkc)
                    .build();

            // 6. 등록 완료 처리
            RegistrationResult result = relyingParty.finishRegistration(finishOptions);

            // 7. 인증정보 엔티티 생성
            String credentialId = WebAuthnUtils.base64UrlEncode(result.getKeyId().getId());

            // 중복 체크
            if (credentialRepository.existsByCredentialId(credentialId)) {
                throw new IllegalStateException("이미 등록된 인증정보입니다: " + credentialId);
            }

            AuthenticatorAttestationResponse response = pkc.getResponse();
            String deviceName = request.deviceName();
            if (deviceName == null || deviceName.isEmpty()) {
                deviceName = "등록된 인증키 #" + (credentialRepository.findAllByUserIdAndStatusNot(
                        user.getId(), CredentialStatus.REVOKED).size() + 1);
            }

            // 기기 유형 추정
            String deviceType = "unknown";
            if (result.getKeyId().getTransports().isPresent()) {
                List<String> transports = result.getKeyId().getTransports().get().stream()
                        .map(AuthenticatorTransport::getId)
                        .toList();

                if (transports.contains("internal")) {
                    deviceType = "platform";
                } else if (transports.contains("usb") || transports.contains("nfc") || transports.contains("ble")) {
                    deviceType = "cross-platform";
                }
            }

            // AAGUID 추출
            String aaguid = response.getAttestation().getAuthenticatorData().getAttestedCredentialData()
                    .map(data -> data.getAaguid().getBase64())
                    .orElse(null);

            WebAuthnCredential credential = WebAuthnCredential.builder()
                    .credentialId(credentialId)
                    .user(user)
                    .name(user.getEmail())
                    .publicKeyCose(Base64.getEncoder().encodeToString(result.getPublicKeyCose().getBytes()))
                    .signatureCount(result.getSignatureCount())
                    .attestationType(result.getAttestationType().name())
                    .registeredAt(LocalDateTime.now())
                    .lastUsedAt(LocalDateTime.now())
                    .aaguid(aaguid)
                    .deviceName(deviceName)
                    .deviceType(deviceType)
                    .status(CredentialStatus.ACTIVE)
                    .build();

            // transports 설정
            if (result.getKeyId().getTransports().isPresent()) {
                List<String> transportList = result.getKeyId().getTransports().get().stream()
                        .map(AuthenticatorTransport::getId)
                        .toList();
                credential.setTransportList(transportList);
            }

            credential = credentialRepository.save(credential);
            log.info("새 인증정보 저장: credentialId={}, userId={}", credential.getCredentialId(), user.getId());

            // 8. 세션 삭제
            sessionRepository.deleteById(session.getId());

            // 9. 결과 반환
            return WebAuthnResponse.success("인증키가 성공적으로 등록되었습니다", WebAuthnCredentialDTO.fromEntity(credential));

        } catch (RegistrationFailedException e) {
            log.error("WebAuthn 등록 검증 실패", e);
            return WebAuthnResponse.error("인증키 등록에 실패했습니다: " + e.getMessage());
        } catch (IOException e) {
            log.error("WebAuthn 등록 완료 JSON 처리 오류", e);
            return WebAuthnResponse.error("인증키 등록 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("WebAuthn 등록 완료 오류", e);
            return WebAuthnResponse.error("인증키 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * WebAuthn 인증 시작
     * 1. 사용자 정보 가져오기
     * 2. 사용자의 인증정보 가져오기
     * 3. 인증 옵션 생성
     * 4. 세션에 인증 옵션 저장
     * 5. 클라이언트에 인증 옵션 반환
     */
    public WebAuthnResponse<?> startAuthentication(AuthenticationRequest request) {
        try {
            log.info("WebAuthn 인증 시작: userId={}", request.userId());

            // 1. 사용자 정보 가져오기
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + request.userId()));

            // 2. 사용자의 활성 인증정보 가져오기
            List<WebAuthnCredential> credentials = credentialRepository.findAllByUserIdAndStatus(
                    user.getId(), CredentialStatus.ACTIVE);

            if (credentials.isEmpty()) {
                log.warn("사용자에게 활성화된 인증정보가 없습니다: {}", user.getId());
                return WebAuthnResponse.error("등록된 인증정보가 없습니다. 먼저 기기를 등록해주세요.");
            }

            // 3. 실행 컨텍스트 생성
            RelyingParty relyingParty = getRelyingParty();

            // 4. 인증키 목록 생성
            List<PublicKeyCredentialDescriptor> allowCredentials = credentials.stream()
                    .map(cred -> PublicKeyCredentialDescriptor.builder()
                            .id(WebAuthnUtils.base64UrlDecodeToByteArray(cred.getCredentialId()))
                            .type(PublicKeyCredentialType.PUBLIC_KEY)
                            .transports(getTransports(cred.getTransportList()))
                            .build())
                    .toList();

            // 5. 사용자 검증 요구사항 설정
            UserVerificationRequirement userVerification = UserVerificationRequirement.PREFERRED;
            if (request.userVerification() != null) {
                try {
                    userVerification = UserVerificationRequirement.valueOf(
                            request.userVerification().toUpperCase());
                } catch (IllegalArgumentException e) {
                    log.warn("잘못된 userVerification 값: {}", request.userVerification());
                }
            }

            // 6. 인증 옵션 생성
            StartAssertionOptions options = StartAssertionOptions.builder()
                    .username(user.getEmail())
                    .userHandle(WebAuthnUtils.createUserHandle(user.getId().toString()))
                    .timeout(60000L) // 1분
                    .userVerification(userVerification)
                    .build();

            AssertionRequest assertionRequest = relyingParty.startAssertion(options);

            // 7. 세션에 인증 옵션 저장
            String sessionId = UUID.randomUUID().toString();
            WebAuthnSession session = WebAuthnSession.builder()
                    .id(sessionId)
                    .userId(user.getId())
                    .challenge(WebAuthnUtils.base64UrlEncode(assertionRequest.getPublicKeyCredentialRequestOptions().getChallenge()))
                    .operation("AUTHENTICATION")
                    .requestJson(objectMapper.writeValueAsString(assertionRequest))
                    .clientIp(getClientIp())
                    .userAgent(getUserAgent())
                    .createdAt(System.currentTimeMillis())
                    .build();

            sessionRepository.save(session);
            log.info("인증 세션 생성: sessionId={}", sessionId);

            // 8. 클라이언트 응답 생성
            Map<String, Object> response = new HashMap<>();
            response.put("challenge", WebAuthnUtils.base64UrlEncode(
                    assertionRequest.getPublicKeyCredentialRequestOptions().getChallenge()));
            response.put("timeout",
                    assertionRequest.getPublicKeyCredentialRequestOptions().getTimeout().orElse(60000L));
            response.put("rpId",
                    assertionRequest.getPublicKeyCredentialRequestOptions().getRpId());
            response.put("userVerification",
                    assertionRequest.getPublicKeyCredentialRequestOptions().getUserVerification().get().getValue());

            // 허용 인증정보 목록 설정
            List<Map<String, Object>> allowList = allowCredentials.stream()
                    .map(cred -> {
                        Map<String, Object> allow = new HashMap<>();
                        allow.put("type", cred.getType().getId());
                        allow.put("id", WebAuthnUtils.base64UrlEncode(cred.getId()));
                        if (cred.getTransports().isPresent()) {
                            allow.put("transports", cred.getTransports().get());
                        }
                        return allow;
                    })
                    .toList();
            response.put("allowCredentials", allowList);

            return WebAuthnResponse.success(response, sessionId);

        } catch (Exception e) {
            log.error("WebAuthn 인증 시작 오류", e);
            return WebAuthnResponse.error("인증 시작 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * WebAuthn 인증 완료
     * 1. 세션 정보 가져오기
     * 2. 클라이언트 응답 데이터 파싱
     * 3. 인증 완료 요청 생성
     * 4. 인증 완료 처리
     * 5. 인증정보 업데이트
     * 6. 세션 삭제
     * 7. 결과 반환
     */
    @Transactional
    public WebAuthnResponse<?> finishAuthentication(AuthenticationFinishRequest request) {
        try {
            log.info("WebAuthn 인증 완료 시작: sessionId={}", request.sessionId());

            // 1. 세션 정보 가져오기
            WebAuthnSession session = sessionRepository.findById(request.sessionId())
                    .orElseThrow(() -> new IllegalArgumentException("인증 세션을 찾을 수 없습니다: " + request.sessionId()));

            if (!"AUTHENTICATION".equals(session.getOperation())) {
                throw new IllegalStateException("잘못된 세션 작업: " + session.getOperation());
            }

            // 2. 사용자 정보 가져오기
            User user = userRepository.findById(session.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + session.getUserId()));

            // 3. 실행 컨텍스트 생성
            RelyingParty relyingParty = getRelyingParty();

            // 4. 클라이언트 응답 데이터 파싱
            AssertionRequest assertionRequest = objectMapper.readValue(
                    session.getRequestJson(), AssertionRequest.class);

            String clientDataJson = objectMapper.writeValueAsString(request.credential());
            PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> pkc =
                    PublicKeyCredential.parseAssertionResponseJson(clientDataJson);

            // 5. 인증 완료 요청 생성
            FinishAssertionOptions finishOptions = FinishAssertionOptions.builder()
                    .request(assertionRequest)
                    .response(pkc)
                    .build();

            // 6. 인증 완료 처리
            AssertionResult result = relyingParty.finishAssertion(finishOptions);

            if (!result.isSuccess()) {
                throw new AssertionFailedException("인증에 실패했습니다");
            }

            // 7. 인증 정보 업데이트
            String credentialId = WebAuthnUtils.base64UrlEncode(result.getCredentialId());
            WebAuthnCredential credential = credentialRepository.findByCredentialId(credentialId)
                    .orElseThrow(() -> new IllegalStateException("인증정보를 찾을 수 없습니다: " + credentialId));

            credential.updateSignatureCount(result.getSignatureCount());
            credential.updateLastUsed();
            credentialRepository.save(credential);

            // 8. 세션 삭제
            sessionRepository.deleteById(session.getId());

            // 9. 결과 생성
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("userId", user.getId());
            responseData.put("credentialId", credential.getCredentialId());
            responseData.put("deviceName", credential.getDeviceName());

            return WebAuthnResponse.success("인증에 성공했습니다", responseData);

        } catch (AssertionFailedException e) {
            log.error("WebAuthn 인증 검증 실패", e);
            return WebAuthnResponse.error("인증에 실패했습니다: " + e.getMessage());
        } catch (IOException e) {
            log.error("WebAuthn 인증 완료 JSON 처리 오류", e);
            return WebAuthnResponse.error("인증 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            log.error("WebAuthn 인증 완료 오류", e);
            return WebAuthnResponse.error("인증 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 사용자의 등록된 WebAuthn 인증정보 목록 조회
     */
    public WebAuthnResponse<List<WebAuthnCredentialDTO>> getCredentials(Long userId) {
        try {
            List<WebAuthnCredential> credentials = credentialRepository.findAllByUserIdAndStatusNot(
                    userId, CredentialStatus.REVOKED);

            List<WebAuthnCredentialDTO> credentialDTOs = credentials.stream()
                    .map(WebAuthnCredentialDTO::fromEntity)
                    .toList();

            return WebAuthnResponse.success(credentialDTOs);
        } catch (Exception e) {
            log.error("WebAuthn 인증정보 조회 오류", e);
            return WebAuthnResponse.error("인증정보 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * WebAuthn 인증정보 삭제 (논리적 삭제 - 상태만 REVOKED로 변경)
     */
    @Transactional
    public WebAuthnResponse<?> revokeCredential(Long userId, Long credentialId) {
        try {
            WebAuthnCredential credential = credentialRepository.findById(credentialId)
                    .orElseThrow(() -> new IllegalArgumentException("인증정보를 찾을 수 없습니다: " + credentialId));

            // 사용자 확인
            if (!credential.getUser().getId().equals(userId)) {
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 다른 인증정보가 있는지 확인
            long activeCredentialCount = credentialRepository.findAllByUserIdAndStatus(
                    userId, CredentialStatus.ACTIVE).size();

            if (activeCredentialCount <= 1) {
                return WebAuthnResponse.error("최소 하나 이상의 인증정보가 필요합니다");
            }

            credential.revoke();
            credentialRepository.save(credential);

            return WebAuthnResponse.success("인증정보가 삭제되었습니다");
        } catch (IllegalArgumentException e) {
            log.error("WebAuthn 인증정보 삭제 오류", e);
            return WebAuthnResponse.error(e.getMessage());
        } catch (Exception e) {
            log.error("WebAuthn 인증정보 삭제 오류", e);
            return WebAuthnResponse.error("인증정보 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * RelyingParty 객체 생성
     */
    private RelyingParty getRelyingParty() {
        RelyingPartyIdentity rpIdentity = RelyingPartyIdentity.builder()
                .id(rpId)
                .name(rpName)
                .build();

        return RelyingParty.builder()
                .identity(rpIdentity)
                .credentialRepository(new CredentialRepositoryAdapter(credentialRepository, userRepository))
                .origins(Set.of(rpOrigin))
                .build();
    }

    /**
     * 전송 방식 목록 추출
     */
    private Optional<Set<AuthenticatorTransport>> getTransports(List<String> transportStrings) {
        if (transportStrings == null || transportStrings.isEmpty()) {
            return Optional.empty();
        }

        Set<AuthenticatorTransport> transports = transportStrings.stream()
                .map(this::parseTransport)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());  // List 대신 Set으로 수집

        return transports.isEmpty() ? Optional.empty() : Optional.of(transports);
    }

    /**
     * 전송 방식 문자열을 AuthenticatorTransport로 변환
     */
    private Optional<AuthenticatorTransport> parseTransport(String transport) {
        try {
            return Optional.of(AuthenticatorTransport.of(transport));
        } catch (IllegalArgumentException e) {
            log.warn("인식할 수 없는 전송 방식: {}", transport);
            return Optional.empty();
        }
    }

    /**
     * 클라이언트 IP 가져오기
     */
    private String getClientIp() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        return ip;
    }

    /**
     * 사용자 에이전트 가져오기
     */
    private String getUserAgent() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        return request.getHeader("User-Agent");
    }

    /**
     * Yubico WebAuthn 라이브러리를 위한 CredentialRepository 어댑터
     */
    private static class CredentialRepositoryAdapter implements com.yubico.webauthn.CredentialRepository {

        private final WebAuthnCredentialRepository credentialRepository;
        private final UserRepository userRepository;

        public CredentialRepositoryAdapter(WebAuthnCredentialRepository credentialRepository, UserRepository userRepository) {
            this.credentialRepository = credentialRepository;
            this.userRepository = userRepository;
        }

        @Override
        public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
            return userRepository.findByEmail(username)
                    .map(user -> {
                        List<WebAuthnCredential> credentials = credentialRepository.findAllByUserIdAndStatus(
                                user.getId(), CredentialStatus.ACTIVE);

                        return credentials.stream()
                                .map(cred -> PublicKeyCredentialDescriptor.builder()
                                        .id(new ByteArray(WebAuthnUtils.base64UrlDecode(cred.getCredentialId())))
                                        .type(PublicKeyCredentialType.PUBLIC_KEY)
                                        .build())
                                .collect(Collectors.toSet());
                    })
                    .orElse(Collections.emptySet());
        }

        @Override
        public Optional<ByteArray> getUserHandleForUsername(String username) {
            return userRepository.findByEmail(username)
                    .map(user -> WebAuthnUtils.createUserHandle(user.getId().toString()));
        }

        @Override
        public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
            try {
                // 사용자 핸들에서 ID 추출
                String userHandleString = new String(userHandle.getBytes());
                // SHA-256 해시를 사용하는 경우 직접 ID로 변환할 수 없으므로
                // 모든 사용자에 대해 핸들을 생성하여 비교
                return userRepository.findAll().stream()
                        .filter(user -> {
                            ByteArray computedHandle = WebAuthnUtils.createUserHandle(user.getId().toString());
                            return computedHandle.equals(userHandle);
                        })
                        .findFirst()
                        .map(User::getEmail);
            } catch (Exception e) {
                log.error("사용자 핸들 매핑 오류", e);
                return Optional.empty();
            }
        }

        @Override
        public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
            String credentialIdString = WebAuthnUtils.base64UrlEncode(credentialId);

            return credentialRepository.findByCredentialId(credentialIdString)
                    .filter(cred -> cred.getStatus() == CredentialStatus.ACTIVE)
                    .map(cred -> RegisteredCredential.builder()
                            .credentialId(credentialId)
                            .userHandle(WebAuthnUtils.createUserHandle(cred.getUser().getId().toString()))
                            .publicKeyCose(new ByteArray(Base64.getDecoder().decode(cred.getPublicKeyCose())))
                            .signatureCount(cred.getSignatureCount())
                            .build());
        }

        @Override
        public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
            String credentialIdString = WebAuthnUtils.base64UrlEncode(credentialId);

            return credentialRepository.findByCredentialId(credentialIdString)
                    .filter(cred -> cred.getStatus() == CredentialStatus.ACTIVE)
                    .map(cred -> RegisteredCredential.builder()
                            .credentialId(credentialId)
                            .userHandle(WebAuthnUtils.createUserHandle(cred.getUser().getId().toString()))
                            .publicKeyCose(new ByteArray(Base64.getDecoder().decode(cred.getPublicKeyCose())))
                            .signatureCount(cred.getSignatureCount())
                            .build())
                    .map(Set::of)
                    .orElse(Collections.emptySet());
        }
    }
} 