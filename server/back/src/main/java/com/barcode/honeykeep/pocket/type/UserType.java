package com.barcode.honeykeep.pocket.type;

public enum UserType {
    MASTER("계획 마스터"),
    LOVER("계획러버"),
    EMOTIONAL("감정 소비러"),
    RUNAWAY("포켓 탈주러");

    private final String label;

    UserType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}

