package com.barcode.honeykeep.chatbot.service;

import com.barcode.honeykeep.chatbot.dto.GenerationResponse;
import com.barcode.honeykeep.chatbot.dto.QueryRequest;
import com.barcode.honeykeep.chatbot.dto.QueryResponse;
import com.barcode.honeykeep.chatbot.entity.ChatMessage;
import com.barcode.honeykeep.chatbot.exception.ChatbotErrorCode;
import com.barcode.honeykeep.chatbot.type.SenderType;
import com.barcode.honeykeep.common.exception.CustomException;
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
import java.util.concurrent.TimeUnit;

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
    public QueryResponse query(UserId user, QueryRequest queryRequest) {
        ObjectMapper objectMapper = new ObjectMapper();
        Long userId = user.value();

        try {
            // 1. 쿼리 유효성 검사
            String query = queryRequest.getQuery();
            if (query == null || query.trim().isEmpty()) {
                throw new CustomException(ChatbotErrorCode.INVALID_QUERY);
            }

            // 2. 사용자 ID를 conversationId로 설정
            queryRequest.setConversationId(userId);

            // 3. 챗봇 클라이언트 호출 (예외 발생 시 상세 에러 처리)
            GenerationResponse generationResponse;

            try {
                generationResponse = chatbotClient.sendQuery(queryRequest);
            } catch (Exception e) {
                log.error("챗봇 클라이언트 호출 중 오류 발생", e);
                throw new CustomException(ChatbotErrorCode.CHATBOT_CLIENT_ERROR);
            }
            log.info("사용자 {}에 대한 챗봇 답변 생성됨: {}", userId, generationResponse.getAnswer());

            // 4. 사용자별 Redis 키 생성: 예, "message_store:chat_history:123"
            final String userChatKey = ROOT_KEY + ":" + userId;
            log.info("사용할 Redis 키: {}", userChatKey);

            // 5. 새 쿼리와 답변 메시지 생성
            List<Map<String, Object>> newMessages = convertMessagesForRAG(query, generationResponse.getAnswer());
            log.info("새로운 메시지 생성됨: {}", newMessages);

            // 6. Redis에 해당 키가 있는지 확인 후, 리스트 자료형으로 메시지 추가
            if (Boolean.TRUE.equals(redisTemplate.hasKey(userChatKey))) {
                log.info("Redis 키 {} 가 존재합니다. 새 메시지를 리스트에 추가합니다.", userChatKey);
                for (Map<String, Object> msg : newMessages) {
                    String msgJson = objectMapper.writeValueAsString(msg);
                    redisTemplate.opsForList().rightPush(userChatKey, msgJson);
                }
            } else {
                log.info("Redis 키 {} 가 존재하지 않습니다. 새로운 리스트를 생성합니다.", userChatKey);
                for (Map<String, Object> msg : newMessages) {
                    String msgJson = objectMapper.writeValueAsString(msg);
                    redisTemplate.opsForList().rightPush(userChatKey, msgJson);
                }
            }

            // 1시간 뒤 삭제
            redisTemplate.expire(userChatKey, 60 * 60, TimeUnit.SECONDS);

            log.info("최종 응답 생성 - 답변: {}", generationResponse.getAnswer());
            return QueryResponse.builder()
                    .answer(generationResponse.getAnswer())
                    .classificationResult(generationResponse.getClassificationResult())
                    .build();

        } catch (JsonProcessingException e) {
            log.error("JSON 처리 중 오류 발생", e);
            throw new CustomException(ChatbotErrorCode.JSON_PARSE_ERROR);
        }
    }

    /**
     * 질문과 답변 메시지를 RAG 서버 스키마에 맞게 변환하는 헬퍼 메서드
     * 여기서는 두 개의 메시지(사용자와 봇)를 리스트에 담아 반환합니다.
     */
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
    public List<ChatMessage> history(Long userId) {
        ObjectMapper objectMapper = new ObjectMapper();

        // 예: "message_store:chat_history:123"
        final String userChatKey = "message_store:chat_history:" + userId;

        // Redis 리스트에서 모든 원소(JSON 문자열) 가져오기
        List<Object> rawList = redisTemplate.opsForList().range(userChatKey, 0, -1);

        // 변환된 메시지를 담을 리스트
        List<ChatMessage> chatMessages = new ArrayList<>();

        if (rawList == null || rawList.isEmpty()) {
            log.info("Redis 키 {}에 저장된 메시지가 없습니다.", userChatKey);
            return null;
        }

        // 각 원소(문자열)를 ChatMessage로 변환
        for (Object item : rawList) {
            String jsonStr = (item instanceof byte[])
                    ? new String((byte[]) item)
                    : item.toString();

            Map<String, Object> map;
            try {
                map = objectMapper.readValue(jsonStr, new TypeReference<Map<String, Object>>() {});
            } catch (JsonProcessingException e) {
                log.error("JSON 파싱 중 오류 발생. 메시지: {}", jsonStr, e);
                throw new CustomException(ChatbotErrorCode.JSON_PARSE_ERROR);
            }
            // "type" 필드와 "data" 필드에서 "content" 추출
            String type = (String) map.get("type");
            Map<String, Object> dataMap = (Map<String, Object>) map.get("data");
            String content = dataMap != null ? (String) dataMap.get("content") : "";

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setContent(content);

            // type -> senderId 매핑
            if ("human".equalsIgnoreCase(type)) {
                chatMessage.setSenderId(SenderType.USER);
            } else {
                chatMessage.setSenderId(SenderType.BOT);
            }

            chatMessages.add(chatMessage);
        }

        log.info("Redis 키 {}에서 총 {}개의 메시지를 변환했습니다.", userChatKey, chatMessages.size());
        return chatMessages;
    }
}
