package com.barcode.honeykeep.auth.dto;

public record EmailVerifyCodeRequest(
        String email,
        String code
) {
}
