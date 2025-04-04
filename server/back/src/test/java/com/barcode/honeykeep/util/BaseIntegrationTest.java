package com.barcode.honeykeep.util;

import com.barcode.honeykeep.auth.util.JwtTokenProvider;
import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.reactive.server.WebTestClient;

@IntegrationTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public abstract class BaseIntegrationTest {
    // 동기
    @Autowired
    protected TestRestTemplate restTemplate;

    // 비동기
    @Autowired
    protected WebTestClient webClient;

    @Autowired
    protected JwtTokenProvider provider;

    @Autowired
    protected JdbcTemplate jdbcTemplate;

    @LocalServerPort
    protected int port;

    protected HttpHeaders headers = new HttpHeaders();

    @BeforeEach
    protected void setup(ApplicationContext context) {
        // 기본 헤더만 설정
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        webClient = WebTestClient
                .bindToServer()
                .baseUrl("http://localhost:" + port + "/api")
                .build();
    }

}
