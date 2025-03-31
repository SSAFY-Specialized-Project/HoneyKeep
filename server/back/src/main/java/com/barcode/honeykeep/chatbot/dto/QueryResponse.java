package com.barcode.honeykeep.chatbot.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class QueryResponse {
    private String answer;
    private Date sentAt;
}
