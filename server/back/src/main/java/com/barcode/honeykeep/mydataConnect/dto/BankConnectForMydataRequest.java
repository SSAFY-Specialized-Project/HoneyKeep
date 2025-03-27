package com.barcode.honeykeep.mydataConnect.dto;

import lombok.Builder;

public record BankConnectForMydataRequest(String bankCode) {
    @Builder
    public BankConnectForMydataRequest {}
}
