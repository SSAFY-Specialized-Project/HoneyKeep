package com.barcode.honeykeep.pay.cache;

import lombok.Builder;
import lombok.Value;
import java.util.Date;

@Value
@Builder
public class QrUuid {
    String uuid;
    Date createdAt;
    boolean isUsed;
}
