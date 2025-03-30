package com.barcode.honeykeep.chatbot.service;

import com.barcode.honeykeep.chatbot.dto.QueryRequest;
import com.barcode.honeykeep.chatbot.entity.ChatMessage;
import com.barcode.honeykeep.chatbot.type.SenderType;
import com.barcode.honeykeep.common.vo.UserId;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatbotClient chatbotClient;
    private final RedisTemplate<String, Object> redisTemplate;
    private final String ROOT_KEY = "message_store:chat_history";

    /**
     * 1. Redis에 chat_history 키가 있는지 확인
     * 2. 있으면 chat_history 하위에 userId 키가 있는지 확인
     * 3. 있으면 userId 하위 메세지 리스트에 새 메세지 추가
     * 4. 없으면 상위 구조 만들어서 Map 생성
     * 5. 마지막에 업데이트 된 메세지 Redis에 추가
     */
    public boolean query(UserId user, QueryRequest queryRequest) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Long userId = user.value();

        // 질문 받아서 답변 생성
        String query = queryRequest.getQuery();
        queryRequest.setConversationId(userId);
        String answer = chatbotClient.sendQuery(queryRequest);

        // 사용자별 Redis 키 생성: 예, "chat_history:123"
        final String userChatKey = ROOT_KEY + ":" + userId;

        // 1-1. chat_history:userId 하위 데이터가 있을 때
        if (Boolean.TRUE.equals(redisTemplate.hasKey(userChatKey))) {

            String chatroomJson = (String) redisTemplate.opsForValue().get(userChatKey);
            List<ChatMessage> chatMessages;

            // 2-1. chat_history:userId 해시가 있으면, 해당 사용자(userId)의 채팅방 데이터를 가져옴 (JSON 문자열)
            if (chatroomJson != null) {

                // 기존 채팅 기록이 있으면 메시지 리스트로 변환
                chatMessages = objectMapper.readValue(chatroomJson, new TypeReference<List<ChatMessage>>() {});
            }
            // 2-2. chat_history:userId 해시가 없으면
            else {
                // 없으면 빈 리스트로 초기화
                chatMessages = new ArrayList<>();
            }

            // 새 쿼리와 답변 메시지를 리스트에 추가
            appendNewQueryAnswer(chatMessages, query, answer);

            // 변경된 리스트를 Redis에 업데이트
            saveChatroom(userId, chatMessages, objectMapper);
        }

        // 1-2. chat_history:userId 하위 데이터가 없을 때
        else {
            // 사용자의 채팅 기록이 없는 경우, 빈 리스트로 새 채팅방 생성
            List<ChatMessage> chatMessages = new ArrayList<>();

            // 새 쿼리와 답변 메시지를 리스트에 추가
            appendNewQueryAnswer(chatMessages, query, answer);

            // Redis에 새 채팅방 저장
            saveChatroom(userId, chatMessages, objectMapper);
        }

        return true;
    }

    // 새로운 쿼리 & 답변 메시지를 생성하여 기존 메시지 리스트에 추가
    private void appendNewQueryAnswer(List<ChatMessage> messages, String query, String answer) {
        // 사용자 질문 메시지 추가 (발신자 "user")
        ChatMessage queryMessage = ChatMessage.builder()
                .senderId(SenderType.USER)
                .content(query)
                .sentAt(new Date())
                .build();

        // 봇 답변 메시지 추가 (발신자 "BOT")
        ChatMessage answerMessage = ChatMessage.builder()
                .senderId(SenderType.BOT)
                .content(answer)
                .sentAt(new Date())
                .build();

        messages.add(queryMessage);
        messages.add(answerMessage);
    }

    // 채팅방을 JSON으로 직렬화하여 Redis의 사용자별 키에 저장
    private void saveChatroom(Long userId, List<ChatMessage> chatMessages, ObjectMapper objectMapper) throws JsonProcessingException {
        String updatedJson = objectMapper.writeValueAsString(chatMessages);
        String userChatKey = ROOT_KEY + ":" + userId;
        redisTemplate.opsForValue().set(userChatKey, updatedJson);
    }
}
