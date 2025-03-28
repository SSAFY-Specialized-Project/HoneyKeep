package com.barcode.honeykeep.pocket.type;

import lombok.Getter;

@Getter
public enum PocketType {
    GATHERING("GATHERING"),     // 모으는 중
    USING("USING"),             // 사용 중
    COMPLETED("COMPLETED")      // 완료됨
    ;

    private final String type;

    PocketType(String type) {
        this.type = type;
    }
}
