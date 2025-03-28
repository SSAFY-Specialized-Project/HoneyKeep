package com.barcode.honeykeep.chatbot.entity;

import com.barcode.honeykeep.chatbot.type.SenderType;
import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class ChatMessage {
    private SenderType senderId;  // 발신자 id
    private String content;   // 대화 내용
    private Date sentAt;      // 전송 시간
}