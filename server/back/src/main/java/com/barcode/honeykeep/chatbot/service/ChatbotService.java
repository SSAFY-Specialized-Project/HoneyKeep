package com.barcode.honeykeep.chatbot.service;

import com.barcode.honeykeep.chatbot.dto.QueryRequest;
import com.barcode.honeykeep.chatbot.dto.QueryResponse;
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

import java.util.*;

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
    public QueryResponse query(UserId user, QueryRequest queryRequest) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        Long userId = user.value();

        // 질문 받아서 답변 생성
        String query = queryRequest.getQuery();
        queryRequest.setConversationId(userId);
        String answer = chatbotClient.sendQuery(queryRequest);
        log.info("사용자 {}에 대한 챗봇 답변 생성됨: {}", userId, answer);

        // 사용자별 Redis 키 생성: 예, "message_store:chat_history:123"
        final String userChatKey = ROOT_KEY + ":" + userId;
        log.info("사용할 Redis 키: {}", userChatKey);

        // 새 쿼리와 답변 메시지 생성
        List<Map<String, Object>> newMessages = convertMessagesForRAG(query, answer);
        log.info("새로운 메시지 생성됨: {}", newMessages);

        // Redis에 해당 키가 있는지 확인 후, 리스트 자료형으로 메시지 추가
        if (Boolean.TRUE.equals(redisTemplate.hasKey(userChatKey))) {
            log.info("Redis 키 {} 가 존재합니다. 새 메시지를 리스트에 추가합니다.", userChatKey);
            // 리스트에 새 메시지들을 오른쪽에 추가 (RPUSH)
            for (Map<String, Object> msg : newMessages) {
                String msgJson = objectMapper.writeValueAsString(msg);
                redisTemplate.opsForList().rightPush(userChatKey, msgJson);
            }
        } else {
            log.info("Redis 키 {} 가 존재하지 않습니다. 새로운 리스트를 생성합니다.", userChatKey);
            // 새로운 리스트에 새 메시지들을 추가
            for (Map<String, Object> msg : newMessages) {
                String msgJson = objectMapper.writeValueAsString(msg);
                redisTemplate.opsForList().rightPush(userChatKey, msgJson);
            }
        }

        log.info("최종 응답 생성 - 답변: {}", answer);
        return QueryResponse.builder()
                .answer(answer)
                .sentAt(new Date())
                .build();
    }

    // 질문과 답변 메시지를 RAG 서버 스키마에 맞게 변환하는 헬퍼 메서드
    // 여기서는 두 개의 메시지(사용자와 봇)를 리스트에 담아 반환합니다.
    private List<Map<String, Object>> convertMessagesForRAG(String query, String answer) {
        List<Map<String, Object>> messages = new ArrayList<>();

        // 사용자 메시지 생성: senderType "human"
        Map<String, Object> userMsg = new HashMap<>();
        userMsg.put("type", "human");
        Map<String, Object> userData = new HashMap<>();
        userData.put("content", query);
        userMsg.put("data", userData);
        messages.add(userMsg);

        // 봇 메시지 생성: senderType "ai"
        Map<String, Object> botMsg = new HashMap<>();
        botMsg.put("type", "ai");
        Map<String, Object> botData = new HashMap<>();
        botData.put("content", answer);
        botMsg.put("data", botData);
        messages.add(botMsg);

        log.info("총 {}개의 메시지를 RAG 형식으로 변환하였습니다.", messages.size());
        return messages;
    }

    /**
     * Redis에 저장된 (type, data.content) 구조의 메시지들을 읽어와
     * ChatMessage(senderId, content) 리스트로 변환합니다.
     */
    public List<ChatMessage> history(Long userId) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        // 예: "message_store:chat_history:123"
        final String userChatKey = "message_store:chat_history:" + userId;

        // Redis 리스트에서 모든 원소(JSON 문자열) 가져오기
        List<Object> rawList = redisTemplate.opsForList().range(userChatKey, 0, -1);

        // 변환된 메시지를 담을 리스트
        List<ChatMessage> chatMessages = new ArrayList<>();

        if (rawList == null || rawList.isEmpty()) {
            log.info("Redis 키 {}에 저장된 메시지가 없습니다.", userChatKey);
            return chatMessages;
        }

        // 각 원소(문자열)를 ChatMessage로 변환
        for (Object item : rawList) {
            // RedisTemplate은 Object 타입을 반환할 수 있으므로, 문자열 변환
            String jsonStr = (item instanceof byte[])
                    ? new String((byte[]) item)
                    : item.toString();

            // JSON 문자열을 Map으로 역직렬화
            Map<String, Object> map = objectMapper.readValue(jsonStr, new TypeReference<Map<String, Object>>() {});

            // "type" 필드와 "data" 필드에서 "content" 추출
            String type = (String) map.get("type");
            Map<String, Object> dataMap = (Map<String, Object>) map.get("data");
            String content = dataMap != null ? (String) dataMap.get("content") : "";

            // ChatMessage 객체 생성
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setContent(content);

            // type -> senderId 매핑
            if ("human".equalsIgnoreCase(type)) {
                chatMessage.setSenderId(SenderType.USER);
            } else if ("ai".equalsIgnoreCase(type)) {
                chatMessage.setSenderId(SenderType.BOT);
            } else {
                // 필요한 경우, 기타 타입 처리
                chatMessage.setSenderId(SenderType.USER);
            }

            chatMessages.add(chatMessage);
        }

        log.info("Redis 키 {}에서 총 {}개의 메시지를 변환했습니다.", userChatKey, chatMessages.size());
        return chatMessages;
    }
}