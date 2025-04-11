package com.barcode.honeykeep.chatbot.entity;

import com.barcode.honeykeep.chatbot.type.SenderType;
import lombok.Data;

@Data
public class ChatMessage {
    private SenderType senderId;  // 발신자 id
    private String content;   // 대화 내용
}