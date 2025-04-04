package com.barcode.honeykeep.util;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.barcode.honeykeep.config.TestConfig;
import com.barcode.honeykeep.config.TestSecurityConfig;
import com.barcode.honeykeep.config.TestcontainersConfiguration;

/**
 * 통합 테스트를 위한 메타 어노테이션
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
//@Sql(scripts = "classpath:sql/clean.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
//@Sql(scripts = "classpath:sql/data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Testcontainers
@Import({TestConfig.class, TestSecurityConfig.class, TestcontainersConfiguration.class})
public @interface IntegrationTest {
}
