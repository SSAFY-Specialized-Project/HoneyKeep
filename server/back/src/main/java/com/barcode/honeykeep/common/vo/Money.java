package com.barcode.honeykeep.common.vo;

import jakarta.persistence.Embeddable;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Objects;

@Embeddable
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Money {
    private BigDecimal amount;

    public Money(BigDecimal amount) {
        validate(amount);   // 검증된 금액만 들어온다.
        this.amount = amount;
    }

    private void validate(BigDecimal amount){
        if (amount == null) {
            throw new IllegalArgumentException("금액은 null일 수 없습니다.");
        }

        if (amount.scale() > 2) {
            throw new IllegalArgumentException("금액은 소수점 둘째 자리까지만 허용됩니다.");
        }

        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("금액은 0보다 작을 수 없습니다.");
        }

        // 너무 큰 금액 방지 (1조원 이상)
        if (amount.compareTo(new BigDecimal("1000000000000")) >= 0) {
            throw new IllegalArgumentException("금액이 너무 큽니다.");
        }
    }

    public static Money of(BigDecimal amount) {
        return new Money(amount);
    }

    public static Money of(String amount) {
        return new Money(new BigDecimal(amount));
    }

    public static Money of(long amount) {
        return new Money(BigDecimal.valueOf(amount));
    }

    public static Money of(double amount) {
        return new Money(BigDecimal.valueOf(amount));
    }

    public static Money zero() {
        return new Money(BigDecimal.ZERO);
    }

    public Money add(Money other) {
        return new Money(this.amount.add(other.amount));
    }

    public Money subtract(Money other) {
        return new Money(this.amount.subtract(other.amount));
    }

    public Money multiply(double multiplier) {
        return new Money(this.amount.multiply(BigDecimal.valueOf(multiplier)));
    }

    public boolean isGreaterThan(Money other) {
        return this.amount.compareTo(other.amount) > 0;
    }

    public boolean isLessThan(Money other) {
        return this.amount.compareTo(other.amount) < 0;
    }

    @Override
    public String toString() {
        return String.format("%,d원", this.amount.longValue());
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Money money = (Money) o;
        return Objects.equals(amount, money.amount);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(amount);
    }

    public boolean isValid() {
        try {
            validate(this.amount);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Long getAmountAsLong() {
        return amount.longValue();
    }
}
