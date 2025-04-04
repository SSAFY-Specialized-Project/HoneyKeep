package com.barcode.honeykeep.integration;

import com.barcode.honeykeep.common.service.RateLimitService;
import com.barcode.honeykeep.util.IntegrationTest;
import io.restassured.RestAssured;
import org.junit.jupiter.api.*;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@IntegrationTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AccountIntegrationTest {

    @LocalServerPort
    private int port;

    @MockitoBean
    private RateLimitService rateLimitService;

    /**
     * 이 부분에 계좌 정보들 입력하면 됩니다.
     */

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

    /**
     * (A-> B) 단일 이체 테스트.
     */
    @Test
    @Order(1)
    void 정상_이체_테스트(){

    }

    /**
     * (A->B, B->A) 동시성 테스트 1. 데드락
     */
    @Test
    @Order(2)
    void 데드락_테스트(){

    }

    /**
     * (A->B, C->B, D->B ...) 동시성 테스트 2. 경쟁 상태
     */
    @Test
    @Order(3)
    void 경쟁_상태_테스트(){

    }
}
