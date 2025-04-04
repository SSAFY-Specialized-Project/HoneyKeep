package com.barcode.honeykeep.integration;

import com.barcode.honeykeep.auth.dto.LoginRequest;
import com.barcode.honeykeep.auth.dto.RegisterRequest;
import com.barcode.honeykeep.common.service.RateLimitService;
import com.barcode.honeykeep.util.IntegrationTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@IntegrationTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthIntegrationTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private RateLimitService rateLimitService;

    private static final String TEST_USERNAME = "integrationtestuser";
    private static final String TEST_PASSWORD = "password123";
    private static final String TEST_EMAIL = "integrationtest@example.com";
    private static final String TEST_NAME = "테스트유저";
    private static final String TEST_IDENTITY_NUMBER = "900101-1"; // 예시 주민번호
    private static final String TEST_PHONE_NUMBER = "010-1234-5678";
    private static String refreshToken;

    // 테스트 실행 전 RestAssured 기본 설정
    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.baseURI = "http://localhost";
        // Mockito.reset(rateLimitService); // 필요시 각 테스트 전에 Mock 리셋

        // rateLimitService.tryConsume 메서드가 항상 true를 반환하도록 설정
        when(rateLimitService.tryConsume(any(String.class), any(RateLimitService.ApiCategory.class))).thenReturn(true);
        when(rateLimitService.getCategoryFromUrl(any(String.class))).thenReturn(RateLimitService.ApiCategory.NORMAL_QUERY); // 필요시 카테고리 반환 설정
    }

    @Test
    @Order(1)
    @DisplayName("회원가입 성공")
    void 회원가입_성공() {
        RegisterRequest registerRequest = new RegisterRequest(
                TEST_NAME,
                TEST_IDENTITY_NUMBER,
                TEST_PHONE_NUMBER,
                TEST_EMAIL,
                TEST_PASSWORD
        );

        given()
                .contentType(ContentType.JSON)
                .body(registerRequest)
        .when()
                .post("/api/v1/auth/register")
        .then()
                .statusCode(HttpStatus.CREATED.value());
    }

    @Test
    @Order(2)
    @DisplayName("로그인 성공 및 토큰 발급")
    void 로그인_성공_토큰_발급() {
        LoginRequest loginRequest = new LoginRequest(
                TEST_EMAIL,
                TEST_PASSWORD
        );

        refreshToken = given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
        .when()
                .post("/api/v1/auth/login")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("data.accessToken", notNullValue())
                .body("message", equalTo("로그인 성공"))
                .cookie("refreshToken", notNullValue())
                .extract().cookie("refreshToken");

        Assertions.assertNotNull(refreshToken, "Refresh 토큰 쿠키가 발급되지 않았습니다.");
    }

    @Test
    @Order(3)
    @DisplayName("잘못된 비밀번호로 로그인 실패")
    void 로그인_실패_잘못된_비밀번호() {
        LoginRequest loginRequest = new LoginRequest(
                TEST_EMAIL,
                "wrongpassword"
        );

        given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
        .when()
                .post("/api/v1/auth/login")
        .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    @Order(4)
    @DisplayName("존재하지 않는 사용자로 로그인 실패")
    void 로그인_실패_존재하지_않는_사용자() {
        LoginRequest loginRequest = new LoginRequest(
                "nonexistent@example.com",
                TEST_PASSWORD
        );

        given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
        .when()
                .post("/api/v1/auth/login")
        .then()
                .statusCode(HttpStatus.NOT_FOUND.value());
    }

    @Test
    @Order(5)
    @DisplayName("유효한 Refresh 토큰으로 Access 토큰 갱신 성공")
    void 토큰_갱신_성공() {
        Assertions.assertNotNull(refreshToken, "이전 테스트에서 Refresh 토큰을 얻지 못했습니다.");

        given()
                .cookie("refreshToken", refreshToken)
        .when()
                .post("/api/v1/auth/reissue")
        .then()
                .statusCode(HttpStatus.OK.value())
                .body("data", notNullValue());
    }

    @Test
    @Order(6)
    @DisplayName("유효하지 않은 Refresh 토큰으로 갱신 실패")
    void 토큰_갱신_실패_유효하지_않은_토큰() {
        String invalidRefreshToken = "thisisninvalidrefreshtoken";

        given()
                .cookie("refreshToken", invalidRefreshToken)
        .when()
                .post("/api/v1/auth/reissue")
        .then()
                .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    // TODO: 이메일 인증 코드 확인, 비밀번호 재설정 등 추가적인 인증 관련 API 테스트 추가
}