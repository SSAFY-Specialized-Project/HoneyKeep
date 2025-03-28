package com.barcode.honeykeep.chatbot.service;

import com.barcode.honeykeep.chatbot.dto.QueryRequest;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class ChatbotClient {
    @Value("${data.url}")
    private String chatbotUrl;

    private final WebClient webClient = WebClient.create(chatbotUrl);

    /**
     * 챗봇 서버에 질문을 보내고, LLM 답변을 받아옴
     */
    public String sendQuery(QueryRequest queryRequest) {
        return webClient.post()
                .uri("/ask")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(queryRequest)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
