package com.barcode.honeykeep.chatbot.service;

import com.barcode.honeykeep.chatbot.dto.GenerationResponse;
import com.barcode.honeykeep.chatbot.dto.QueryRequest;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@Slf4j
public class ChatbotClient {

    private final WebClient webClient;

    public ChatbotClient(@Value("${data.url}") String chatbotUrl) {
        this.webClient = WebClient.create(chatbotUrl);
    }

    /**
     * 챗봇 서버에 질문을 보내고, LLM 답변을 받아옴
     */
    public GenerationResponse sendQuery(QueryRequest queryRequest) {
        return webClient.post()
                .uri("/chatbot/ask")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(queryRequest)
                .retrieve()
                .bodyToMono(GenerationResponse.class)
                .block();
    }
}
