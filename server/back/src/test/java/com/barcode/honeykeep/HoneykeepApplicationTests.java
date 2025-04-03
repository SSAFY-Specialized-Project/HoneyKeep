package com.barcode.honeykeep;

import com.barcode.honeykeep.config.TestcontainersConfiguration;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@Import(TestcontainersConfiguration.class)
@SpringBootTest()
class HoneykeepApplicationTests {

    @Test
    void contextLoads() {
    }

}
