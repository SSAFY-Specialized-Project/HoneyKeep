package com.barcode.honeykeep.auth.dto;

import com.barcode.honeykeep.auth.entity.User;

public record RegisterResponse(String userKey) {

    public static RegisterResponse toDto(User user){
        return new RegisterResponse(
            user.getUserKey()
        );
    }
}
