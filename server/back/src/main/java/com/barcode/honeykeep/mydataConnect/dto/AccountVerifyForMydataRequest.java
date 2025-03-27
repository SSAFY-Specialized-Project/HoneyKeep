package com.barcode.honeykeep.mydataConnect.dto;

public record AccountVerifyForMydataRequest(
        String accountNo,
        String authCode
) {}
