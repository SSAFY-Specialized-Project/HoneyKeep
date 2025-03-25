package com.barcode.honeykeep.common.vo;

import java.util.Objects;

import lombok.Getter;

public record UserId(Long value) {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserId userId = (UserId) o;
        return Objects.equals(value, userId.value);
    }

    @Override
    public String toString() {
        return value != null ? value.toString() : "null";
    }

}
