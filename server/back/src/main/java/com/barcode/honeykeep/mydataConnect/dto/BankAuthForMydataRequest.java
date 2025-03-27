package com.barcode.honeykeep.mydataConnect.dto;

public record BankAuthForMydataRequest(
        String bankCode,
        String accountNo
) {}
