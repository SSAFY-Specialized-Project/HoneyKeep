package com.barcode.honeykeep.mydataConnect.dto;

import lombok.Builder;

public record BankConnectRequest(String bankCode) {
    @Builder
    public BankConnectRequest {}
}
