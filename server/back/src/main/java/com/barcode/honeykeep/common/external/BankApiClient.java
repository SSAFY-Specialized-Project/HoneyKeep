package com.barcode.honeykeep.common.external;

import com.barcode.honeykeep.common.exception.CustomException;
import com.barcode.honeykeep.common.external.dto.ConnectableBankDto;
import com.barcode.honeykeep.common.vo.Money;
import com.barcode.honeykeep.mydataConnect.dto.AccountDto;
import com.barcode.honeykeep.mydataConnect.dto.AccountListResponse;
import com.barcode.honeykeep.mydataConnect.dto.BankAuthResponse;
import com.barcode.honeykeep.mydataConnect.exception.MydataErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
@RequiredArgsConstructor
public class BankApiClient {

    private final WebClient externalBankWebClient;

    @Value("${external.bank.institution-code}")
    private String institutionCode;

    @Value("${external.bank.fintech-app-no}")
    private String fintechAppNo;

    @Value("${external.bank.api-key}")
    private String apiKey;

    private static final String BANK_LIST_URI = "/edu/bank/inquireBankCodes";
    private static final String ACCOUNT_LIST_URI = "/edu/account/inquireAccountList";

    public List<ConnectableBankDto> getBankCodes() {
        Map<String, Object> header = createHeader(
                "inquireBankCodes",
                "inquireBankCodes",
                null
        );

        return externalBankWebClient.post()
                .uri(BANK_LIST_URI)
                .bodyValue(wrapHeader(header))
                .retrieve()
                .bodyToFlux(ConnectableBankDto.class)
                .collectList()
                .block();
    }

    public List<AccountDto> getAccounts(String userKey) {
        Map<String, Object> header = createHeader(
                "inquireDemandDepositAccountList",
                "inquireDemandDepositAccountList",
                userKey
        );

        AccountListResponse response = externalBankWebClient.post()
                .uri(ACCOUNT_LIST_URI)
                .bodyValue(wrapHeader(header))
                .retrieve()
                .bodyToMono(AccountListResponse.class)
                .block();

        return response != null ? response.REC() : Collections.emptyList();

    }

    public BankAuthResponse requestAccountAuth(String userKey, String accountNo) {
        Map<String, Object> header = createHeader(
                "openAccountAuth", "openAccountAuth", userKey
        );

        Map<String, Object> body = new HashMap<>();
        body.put("Header", header);
        body.put("accountNo", accountNo);
        body.put("authText", "SSAFY");

        Map<String, Object> response = externalBankWebClient.post()
                .uri("/edu/account/openAccountAuth")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        if (response == null || !response.containsKey("REC")) {
            throw new CustomException(MydataErrorCode.ACCOUNT_AUTH_FAILED);
        }

        Map<String, Object> rec = (Map<String, Object>) response.get("REC");
        return new BankAuthResponse(
                rec.get("transactionUniqueNo").toString(),
                rec.get("accountNo").toString()
        );
    }


    private Map<String, Object> createHeader(String apiName, String apiServiceCode, String userKey) {
        Map<String, Object> header = new HashMap<>();
        header.put("apiName", apiName);
        header.put("transmissionDate", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.put("transmissionTime", LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss")));
        header.put("institutionCode", institutionCode);
        header.put("fintechAppNo", fintechAppNo);
        header.put("apiServiceCode", apiServiceCode);
        header.put("institutionTransactionUniqueNo", generateTransactionId());
        header.put("apiKey", apiKey);
        if (userKey != null) header.put("userKey", userKey);
        return header;
    }

    private Map<String, Object> wrapHeader(Map<String, Object> header) {
        return Map.of("Header", header);
    }

    private String generateTransactionId() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String sequence = String.format("%06d", new Random().nextInt(1_000_000));
        return timestamp + sequence;
    }

    public Map<String, Object> verifyAccountAuthCode(String userKey, String accountNo, String authCode) {
        Map<String, Object> header = createHeader(
                "checkAuthCode", "checkAuthCode", userKey
        );

        Map<String, Object> body = Map.of(
                "Header", header,
                "accountNo", accountNo,
                "authText", "SSAFY",
                "authCode", authCode
        );

        Map<String, Object> response = externalBankWebClient.post()
                .uri("/edu/account/checkAuthCode")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        return (Map<String, Object>) response.get("REC");
    }

    public AccountDto getAccount(String userKey, String accountNo) {
        Map<String, Object> header = createHeader(
                "inquireDemandDepositAccount",
                "inquireDemandDepositAccount",
                userKey
        );

        Map<String, Object> body = Map.of(
                "Header", header,
                "accountNo", accountNo
        );

        Map<String, Object> response = externalBankWebClient.post()
                .uri("/edu/account/inquireAccount")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        if (response == null || !"H0000".equals(getHeaderValue(response, "responseCode"))) {
            throw new CustomException(MydataErrorCode.ACCOUNT_DETAIL_FETCH_FAILED);
        }

        Map<String, Object> rec = (Map<String, Object>) response.get("REC");

        return new AccountDto(
                (String) rec.get("bankCode"),
                (String) rec.get("bankName"),
                (String) rec.get("userName"),
                (String) rec.get("accountNo"),
                (String) rec.get("accountName"),
                (String) rec.get("accountTypeCode"),
                (String) rec.get("accountTypeName"),
                (String) rec.get("accountCreatedDate"),
                (String) rec.get("accountExpiryDate"),
                (String) rec.get("dailyTransferLimit"),
                (String) rec.get("oneTimeTransferLimit"),
                (String) rec.get("accountBalance"),
                (String) rec.get("lastTransactionDate"),
                (String) rec.get("currency")
        );

    }

    // 응답 헤더에서 값 가져오기
    private String getHeaderValue(Map<String, Object> response, String key) {
        Map<String, Object> header = (Map<String, Object>) response.get("Header");
        return header != null ? (String) header.get(key) : null;
    }

    // "" 빈 문자열 처리
    private LocalDate parseNullableDate(String value) {
        if (value == null || value.isBlank()) return null;
        return LocalDate.parse(value, DateTimeFormatter.ofPattern("yyyyMMdd"));
    }


}
