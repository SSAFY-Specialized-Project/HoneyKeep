package com.barcode.honeykeep.chatbot.controller;

import com.barcode.honeykeep.chatbot.dto.QueryRequest;
import com.barcode.honeykeep.chatbot.service.ChatbotService;
import com.barcode.honeykeep.common.response.ApiResponse;
import com.barcode.honeykeep.common.vo.UserId;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    /**
     * 사용자가 채팅하기를 클릭하면 채팅방을 생성합니다.
     * 사용자의 id를 가지고 mongodb에 빈 채팅방 엔티티를 만들어둡니다.
     */
    @PostMapping("/chatroom")
    public ResponseEntity<ApiResponse<Boolean>> query(@AuthenticationPrincipal UserId userId, @RequestBody QueryRequest queryRequest) throws JsonProcessingException {
        boolean isSuccessfullyCreated = chatbotService.query(userId, queryRequest);

        return ResponseEntity.ok()
                .body(ApiResponse.success(true));
    }

}
