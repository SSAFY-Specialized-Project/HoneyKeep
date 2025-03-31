package com.barcode.honeykeep.cert.controller;

import com.barcode.honeykeep.cert.dto.AccountConfirmRequest;
import com.barcode.honeykeep.cert.dto.AccountVerificationRequest;
import com.barcode.honeykeep.cert.service.CertService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

//TODO: 구현 다하고 나서는 mydata의 1원인증 및 인증코드 확인 api는 제거

@Slf4j
@RestController
@RequestMapping("/api/v1/cert")
@RequiredArgsConstructor
public class CertController {

    private final CertService certService;

    /**
     * 1원 인증 요청
     * @param userId
     * @param request
     * @return
     */
    @PostMapping("/verify-account/request")
    public ResponseEntity<ApiResponse<Void>> requestAccountVerification(
            @AuthenticationPrincipal UserId userId,
            @RequestBody AccountVerificationRequest request) {
        certService.sendTransferCode(userId, request);

        return ResponseEntity.ok()
                .body(ApiResponse.success("1원 인증 요청 성공", null));
    }

    /**
     * 1원 인증 검증. 상태코드가 200이 반환된다면 프론트에서는 공개키와 개인키를 만들고, 인증서를 만드는 API를 호출해야 한다.
     * @param userId
     * @param request
     * @return
     */
    @PostMapping("/verify-account/confirm")
    public ResponseEntity<ApiResponse<Void>> confirmAccountVerification(
            @AuthenticationPrincipal UserId userId,
            @RequestBody AccountConfirmRequest request) {
        certService.confirmTransferCode(userId, request);

        return ResponseEntity.ok()
                .body(ApiResponse.success("1원 인증 성공", null));
    }

}
