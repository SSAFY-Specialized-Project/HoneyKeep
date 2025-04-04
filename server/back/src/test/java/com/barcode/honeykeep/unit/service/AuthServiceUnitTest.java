package com.barcode.honeykeep.unit.service;

import com.barcode.honeykeep.auth.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class AuthServiceUnitTest {

    @InjectMocks
    private AuthService authService;

    @Nested
    @DisplayName("회원가입")
    class Register {
        @Test
        @DisplayName("201 - 회원가입 성공")
        void successRegisterUser() {
            //given

            //when

            //then
        }

        @Test
        @DisplayName("409 - 이미 가입된 사용자")
        void conflictRegisterUser() {

        }
    }

}
