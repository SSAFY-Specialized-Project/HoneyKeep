package com.barcode.honeykeep.chatbot.dto;

import lombok.Data;

@Data
public class QueryRequest {
    String query;
    Long conversationId;
}
