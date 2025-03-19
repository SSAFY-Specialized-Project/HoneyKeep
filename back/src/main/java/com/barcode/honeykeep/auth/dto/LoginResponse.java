package com.barcode.honeykeep.auth.dto;

import lombok.Builder;

@Builder
public record LoginResponse(String accessToken) {
}
