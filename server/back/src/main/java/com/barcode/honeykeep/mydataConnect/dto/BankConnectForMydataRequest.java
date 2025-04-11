package com.barcode.honeykeep.mydataConnect.dto;

import java.util.List;

public record BankConnectForMydataRequest(
        List<String> bankCodes
) {
}
