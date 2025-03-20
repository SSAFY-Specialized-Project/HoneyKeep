package com.barcode.honeykeep.common.vo;

import lombok.Getter;

import java.util.Objects;

@Getter
public class UserId {

    private final Integer value;

    public UserId(Integer value) {
        this.value = value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserId userId = (UserId) o;
        return Objects.equals(value, userId.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

}
