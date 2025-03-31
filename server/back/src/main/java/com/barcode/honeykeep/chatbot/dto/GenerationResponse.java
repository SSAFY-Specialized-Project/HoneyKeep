package com.barcode.honeykeep.chatbot.dto;

import lombok.Data;

@Data
public class GenerationResponse {
    String answer;
    int classificationResult;
}
