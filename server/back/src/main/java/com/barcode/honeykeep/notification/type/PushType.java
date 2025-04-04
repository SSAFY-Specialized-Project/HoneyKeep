package com.barcode.honeykeep.notification.type;

import lombok.Getter;

@Getter
public enum PushType {
    TRANSFER("TRANSFER"),
    PAYMENT("PAYMENT")
    ;

    private final String type;

    PushType(String type) {
        this.type = type;
    }

}
