package com.barcode.honeykeep.pocket.type;

import lombok.Getter;

@Getter
public enum PocketType {
    UNUSED("UNUSED"),       // 미사용
    USING("USING"),         // 사용 중
    USED("USED"),           // 완료 - 계획대로 사용함
    EXCEEDED("EXCEEDED")    // 완료 - 초과 지출
    ;

    private final String type;

    PocketType(String type) {
        this.type = type;
    }
}
