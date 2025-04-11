package com.barcode.honeykeep;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import com.barcode.honeykeep.config.TestConfig;
import com.barcode.honeykeep.config.TestcontainersConfiguration;

@ActiveProfiles("test")
@Import({TestcontainersConfiguration.class, TestConfig.class})
@SpringBootTest()
class HoneykeepApplicationTests {

    @Test
    void contextLoads() {
    }

}
