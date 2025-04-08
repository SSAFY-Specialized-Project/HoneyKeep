package com.barcode.honeykeep.notification.type;

import lombok.Getter;

@Getter
public enum PushType {
    TRANSFER("TRANSFER"),
    PAYMENT("PAYMENT"),
    REMINDER("REMINDER"),
    CRAWLING("CRAWLING");

    private final String type;

    PushType(String type) {
        this.type = type;
    }

}
