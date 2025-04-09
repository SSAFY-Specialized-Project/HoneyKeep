package com.barcode.honeykeep.integration;

import com.barcode.honeykeep.auth.dto.LoginRequest;
import com.barcode.honeykeep.common.service.RateLimitService;
import com.barcode.honeykeep.config.TestSecurityConfig;
import com.barcode.honeykeep.util.IntegrationTest;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.jdbc.Sql;

import java.math.BigDecimal;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.hamcrest.Matchers.notNullValue;

@IntegrationTest
@Import(TestSecurityConfig.class)
@Sql(scripts = "classpath:sql/clean.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Sql(scripts = "classpath:sql/data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AccountIntegrationTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private RateLimitService rateLimitService;

    // 테스트 전체에서 사용할 access token
    private static String accessTokenUser1;
    private static String accessTokenUser2;
    private static String accessTokenUser3;
    // 테스트 실행 전 RestAssured 기본 설정
    @BeforeEach
    void setUp() {
        RestAssured.port = port;
        RestAssured.baseURI = "http://localhost";

        // rateLimitService.tryConsume 메서드가 항상 true를 반환하도록 설정
        when(rateLimitService.tryConsume(any(String.class), any(RateLimitService.ApiCategory.class))).thenReturn(true);
        when(rateLimitService.getCategoryFromUrl(any(String.class))).thenReturn(RateLimitService.ApiCategory.NORMAL_QUERY); // 필요시 카테고리 반환 설정
        // user1 로그인: SQL 데이터에 삽입된 user1의 이메일과 비밀번호 사용 (예: user1@example.com, password1)
        if (accessTokenUser1 == null) {
            LoginRequest loginRequest1 = new LoginRequest("user1@example.com", "password1");
            accessTokenUser1 = given()
                    .contentType(ContentType.JSON)
                    .body(loginRequest1)
                    .when()
                    .post("/api/v1/auth/login")
                    .then()
                    .statusCode(200)
                    .body("data.accessToken", notNullValue())
                    .extract().path("data.accessToken", String.valueOf(String.class));
            assertNotNull(accessTokenUser1, "user1의 access token이 발급되지 않았습니다.");
        }

        // user2 로그인: SQL 데이터에 삽입된 user2의 이메일과 비밀번호 사용 (예: user2@example.com, password2)
        if (accessTokenUser2 == null) {
            LoginRequest loginRequest2 = new LoginRequest("user2@example.com", "password2");
            accessTokenUser2 = given()
                    .contentType(ContentType.JSON)
                    .body(loginRequest2)
                    .when()
                    .post("/api/v1/auth/login")
                    .then()
                    .statusCode(200)
                    .body("data.accessToken", notNullValue())
                    .extract().path("data.accessToken", String.valueOf(String.class));
            assertNotNull(accessTokenUser2, "user2의 access token이 발급되지 않았습니다.");
        }

        // user3 로그인: SQL 데이터에 삽입된 user3의 이메일과 비밀번호 사용 (예: user3@example.com, password3)
        if (accessTokenUser3 == null) {
            LoginRequest loginRequest3 = new LoginRequest("user3@example.com", "password3");
            accessTokenUser3 = given()
                    .contentType(ContentType.JSON)
                    .body(loginRequest3)
                    .when()
                    .post("/api/v1/auth/login")
                    .then()
                    .statusCode(200)
                    .body("data.accessToken", notNullValue())
                    .extract().path("data.accessToken", String.valueOf(String.class));
            assertNotNull(accessTokenUser3, "user3의 access token이 발급되지 않았습니다.");
        }

    }

    /**
     * (A-> B) 단일 이체 테스트.
     */
    @Test
    @Order(1)
    @DisplayName("정상 계좌 이체 테스트: 사용자1의 A → B")
    void 정상_이체_테스트(){
        // 이체 요청 JSON 문자열 구성
        String transferRequestJson = "{"
                + "\"withdrawAccountId\": 1,"              // 출금 계좌: 계좌 A (사용자1 소유)
                + "\"depositAccountNumber\": \"B-0001\","     // 입금 계좌: 계좌 B (사용자1 소유)
                + "\"transferAmount\": 1000"                  // 이체 금액: 1,000원
                + "}";

        // POST 요청을 통해 계좌 이체 API를 호출하고 응답을 검증
        // 여기서는 기본적인 응답 상태 및 일부 필드를 Hamcrest matcher로 검증합니다.
        given()
                .header("Authorization", "Bearer " + accessTokenUser1)  // JWT 토큰 포함
                .contentType(ContentType.JSON)
                .body(transferRequestJson)
                .when()
                .post("/api/v1/accounts/execute")
                .then()
                .statusCode(200)
                .body("data.message", equalTo("Transfer successful"))
                .body("data.withdrawAccountId", equalTo(1))
                .body("data.depositAccountId", equalTo(2));

        // 이제, 정확한 금액을 BigDecimal로 비교하기 위해 GET 요청 후 값 추출

        // 1. 계좌 A 잔액 확인
        Float withdrawBalanceDouble = given()
                .header("Authorization", "Bearer " + accessTokenUser1)
                .contentType(ContentType.JSON)
                .when()
                .get("/api/v1/accounts/1")
                .then()
                .statusCode(200)
                .extract().path("data.accountBalance");

        // Double 값을 BigDecimal로 변환
        BigDecimal actualWithdrawBalance = BigDecimal.valueOf(withdrawBalanceDouble);
        // 예상 금액을 BigDecimal로 정의 (정확한 값, 예: "9000" 또는 "9000.00")
        BigDecimal expectedWithdrawBalance = new BigDecimal("9000.00");

        // BigDecimal 비교: compareTo()가 0이면 값이 같다.
        assertTrue(expectedWithdrawBalance.compareTo(actualWithdrawBalance) == 0,
                "계좌 A의 잔액이 예상과 다릅니다. 예상: " + expectedWithdrawBalance + ", 실제: " + actualWithdrawBalance);

        // 2. 계좌 B 잔액 확인
        Float depositBalanceDouble = given()
                .header("Authorization", "Bearer " + accessTokenUser1)
                .contentType(ContentType.JSON)
                .when()
                .get("/api/v1/accounts/2")
                .then()
                .statusCode(200)
                .extract().path("data.accountBalance");

        BigDecimal actualDepositBalance = BigDecimal.valueOf(depositBalanceDouble);
        BigDecimal expectedDepositBalance = new BigDecimal("6000.00");

        assertTrue(expectedDepositBalance.compareTo(actualDepositBalance) == 0,
                "계좌 B의 잔액이 예상과 다릅니다. 예상: " + expectedDepositBalance + ", 실제: " + actualDepositBalance);
    }

    /**
     * (유저1 -> 유저2, 유저2 -> 유저1) 동시성 테스트 1. 데드락
     */
    @Test
    @Order(2)
    @DisplayName("데드락 테스트: 사용자1과 사용자2 간 동시 이체")
    void 데드락_테스트() throws InterruptedException{
        // CountDownLatch:  Java의 동시성 유틸리티 클래스이다.
        // 여러 스레드가 특정 시점까지 대기하도록 만드는 동기화 도구
        // 2개의 스레드가 동시에 시작할 수 있도록 대기 -> 초기 카운트 1로 설정 -> 0이되면 대기하고 있던 모든 스레드 실행
        // latch.countDown()이 호출되기 전에는 두 작업 모두 latch.await()에서 대기하게 됩니다.
        CountDownLatch latch = new CountDownLatch(1);

        // ExecutorService:  2개의 스레드를 동시에 실행할 스레드 풀을 생성합니다.
        ExecutorService executor = Executors.newFixedThreadPool(2);

        //스레드 1 : 사용자1의 계좌 A에서 사용자2의 계좌 C로 1000원 이체 요청
        Runnable taskAtoB = () -> {
            try {
                //CountDownLatch가 0이 될 때까지 대기한다.
                latch.await();


                String requestJson = "{" +
                        "\"withdrawAccountId\": 1," + //출금 계좌
                        "\"depositAccountNumber\": \"C-0001\"," + //입금 계좌
                        "\"transferAmount\": 1000" + //이체 금액
                        "}";
                given()
                        .header("Authorization", "Bearer " + accessTokenUser1)
                        .contentType(ContentType.JSON)
                        .body(requestJson)
                        .when()
                        .post("/api/v1/accounts/execute")
                        .then()
                        .statusCode(200);
            } catch (InterruptedException e) {
                // 작업 중 인터럽트가 발생하면 현재 스레드를 인터럽트 상태로 설정합니다.
                Thread.currentThread().interrupt();
            }
        };

        // Runnable : 스레드가 실행할 작업(코드 블록)을 정의하는 함수형 인터페이스
        Runnable taskBtoA = () -> {
            try {
                // CountDownLatch가 0이 될 때까지 대기
                latch.await();

                String requestJson = "{" +
                        "\"withdrawAccountId\": 3," +
                        "\"depositAccountNumber\": \"A-0001\"," +
                        "\"transferAmount\": 500" +
                        "}";
                given()
                        .header("Authorization", "Bearer " + accessTokenUser2)
                        .contentType(ContentType.JSON)
                        .body(requestJson)
                        .when()
                        .post("/api/v1/accounts/execute")
                        .then()
                        .statusCode(200);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };

        // taskAtoB, taskBtoA Runnable 작업을 스레드 풀에 제출
        // 여러 Runnable들을 executor에 제출
        executor.submit(taskAtoB);
        executor.submit(taskBtoA);


        // CountDownLatch의 카운트를 0으로 설정하여, 대기 중인 모든 스레드가 동시에 실행되도록 합니다.
        latch.countDown();

        // ExecutorService에 더 이상 새로운 작업을 받지 않고,
        // 이미 제출된 작업들은 실행한 후에 스레드 풀을 종료하라는 신호를 보낸다.
        executor.shutdown();

        // 모든 작업이 종료되지 않았다면  메인 스레드가 계속해서 대기
        //  비동기 작업이 완전히 끝나고 최종 결과를 검증하기 위함
        while (!executor.isTerminated()) {
            // 현재 스레드를 100밀리초 동안 일시정지
            Thread.sleep(100);
        }

        // 최종 잔액 검증 (user1의 계좌 A와 B)
        Float finalBalanceA = given()
                .header("Authorization", "Bearer " + accessTokenUser1)
                .contentType(ContentType.JSON)
                .when()
                .get("/api/v1/accounts/1")
                .then()
                .statusCode(200)
                .extract().path("data.accountBalance");
        BigDecimal actualFinalBalanceA = BigDecimal.valueOf(finalBalanceA);
        BigDecimal expectedFinalBalanceA = new BigDecimal("9500.00");

        Float finalBalanceB = given()
                .header("Authorization", "Bearer " + accessTokenUser2)
                .contentType(ContentType.JSON)
                .when()
                .get("/api/v1/accounts/3")
                .then()
                .statusCode(200)
                .extract().path("data.accountBalance");
        BigDecimal actualFinalBalanceB = BigDecimal.valueOf(finalBalanceB);
        BigDecimal expectedFinalBalanceB = new BigDecimal("8500.00");

        assertTrue(expectedFinalBalanceA.compareTo(actualFinalBalanceA) == 0,
                "계좌 A의 최종 잔액이 예상과 다릅니다. 예상: " + expectedFinalBalanceA + ", 실제: " + actualFinalBalanceA);
        assertTrue(expectedFinalBalanceB.compareTo(actualFinalBalanceB) == 0,
                "계좌 C의 최종 잔액이 예상과 다릅니다. 예상: " + expectedFinalBalanceB + ", 실제: " + actualFinalBalanceB);
    }

    /**
     * (A->B, C->B, D->B ...) 동시성 테스트 2. 경쟁 상태
     */
    @Test
    @Order(3)
    void 경쟁_상태_테스트(){

    }
}
