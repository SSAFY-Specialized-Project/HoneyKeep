package com.barcode.honeykeep.pocket.type;

import lombok.Getter;

@Getter
public enum PocketType {
    UNUSED("UNUSED"),
    USING("USING"),
    USED("USED")
    ;

    private final String type;

    PocketType(String type) {
        this.type = type;
    }
}
