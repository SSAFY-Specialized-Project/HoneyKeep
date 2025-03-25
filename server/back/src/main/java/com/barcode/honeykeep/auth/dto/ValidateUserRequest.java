package com.barcode.honeykeep.auth.dto;

public record ValidateUserRequest(
        String name,
        String identityNumber,
        String phoneNumber,
        String email
) {
}
