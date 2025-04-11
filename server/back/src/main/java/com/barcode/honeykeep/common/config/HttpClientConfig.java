package com.barcode.honeykeep.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class HttpClientConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("https://finopenapi.ssafy.io/ssafy/api/v1")
                .build();
    }

    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        return builder.build();
    }
}