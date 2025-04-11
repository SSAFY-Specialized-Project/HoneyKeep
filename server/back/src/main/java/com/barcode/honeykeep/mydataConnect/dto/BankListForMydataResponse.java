package com.barcode.honeykeep.mydataConnect.dto;

public record BankListForMydataResponse(
        String bankCode,
        String bankName,
        boolean isLinked
) {}
