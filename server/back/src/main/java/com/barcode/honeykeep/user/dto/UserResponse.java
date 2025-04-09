package com.barcode.honeykeep.user.dto;

public record UserResponse(
    Long userId,
    String email,
    String name
) {
}
