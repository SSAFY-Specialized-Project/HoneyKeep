package com.barcode.honeykeep.auth.dto;

public record RegisterRequest(
        String name,
        String identityNumber,
        String phoneNumber,
        String email,
        String password) {
}
