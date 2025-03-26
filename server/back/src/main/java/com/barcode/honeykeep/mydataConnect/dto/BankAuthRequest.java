package com.barcode.honeykeep.mydataConnect.dto;

public record BankAuthRequest(
        String bankCode,
        String accountNo
) {}
