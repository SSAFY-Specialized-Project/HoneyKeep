package com.barcode.honeykeep;

import org.springframework.boot.SpringApplication;

public class TestHoneykeepApplication {

    public static void main(String[] args) {
        SpringApplication.from(HoneykeepApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
