package com.barcode.honeykeep.mydataConnect.dto;

import com.barcode.honeykeep.common.vo.Money;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

public record AccountDto(
        String bankCode,
        String bankName,
        String userName,
        String accountNo,
        String accountName,
        String accountTypeCode,
        String accountTypeName,
        String accountCreatedDate,
        String accountExpiryDate,
        String dailyTransferLimit,
        String oneTimeTransferLimit,
        String accountBalance,
        String lastTransactionDate,
        String currency
) {
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    public static AccountDto from(Map<String, Object> rec) {
        return new AccountDto(
                (String) rec.get("bankCode"),
                (String) rec.get("bankName"),
                (String) rec.get("userName"),
                (String) rec.get("accountNo"),
                (String) rec.get("accountName"),
                (String) rec.get("accountTypeCode"),
                (String) rec.get("accountTypeName"),
                (String) rec.get("accountCreatedDate"),
                (String) rec.get("accountExpiryDate"),
                (String) rec.get("dailyTransferLimit"),
                (String) rec.get("oneTimeTransferLimit"),
                (String) rec.get("accountBalance"),
                (String) rec.get("lastTransactionDate"),
                (String) rec.get("currency")
        );
    }

    public Money accountBalanceAsMoney() {
        return new Money(new BigDecimal(this.accountBalance));
    }

    public Money dailyTransferLimitAsMoney() {
        return new Money(new BigDecimal(this.dailyTransferLimit));
    }

    public Money oneTimeTransferLimitAsMoney() {
        return new Money(new BigDecimal(this.oneTimeTransferLimit));
    }


    public LocalDate accountExpiryDateAsLocalDate() {
        return LocalDate.parse(this.accountExpiryDate, DATE_FORMAT);
    }

    public LocalDate lastTransactionDateAsLocalDate() {
        if (this.lastTransactionDate == null || this.lastTransactionDate.isBlank()) {
            return null;
        }
        return LocalDate.parse(this.lastTransactionDate, DATE_FORMAT);
    }
}
