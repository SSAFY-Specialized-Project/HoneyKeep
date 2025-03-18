package com.barcode.honeykeep.notification.type;

import lombok.Getter;

@Getter
public enum PushType {

    ;

    private final String type;

    PushType(String type) {
        this.type = type;
    }

}
