package com.barcode.honeykeep.pay.cache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class QrUuid {
    String uuid;
    Instant createdAt;
    boolean isUsed;
}
